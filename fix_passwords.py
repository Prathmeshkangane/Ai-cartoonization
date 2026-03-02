"""
fix_passwords.py  (v2)
Run this ONCE from your project root to re-hash any plain-text passwords.

Usage:
    cd C:\\Users\\Prathmesh\\Desktop\\CartoonizeMe\\cartoonize_app
    python fix_passwords.py

What it does:
  - Scans every row in `users`
  - If the stored password is NOT a valid bcrypt hash, it re-hashes it
  - Prints a summary so you know exactly what was fixed
  - You'll need to know the plain-text password for each affected user,
    OR just delete those rows and re-register (see option below)
"""

import sqlite3
import os
import bcrypt

_HERE   = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(_HERE, "cartoonize.db")

print(f"Database: {DB_PATH}\n")

def is_bcrypt_hash(value: str) -> bool:
    """Return True if value looks like a valid bcrypt hash."""
    try:
        return (
            isinstance(value, str)
            and value.startswith(("$2b$", "$2a$", "$2y$"))
            and len(value) == 60
        )
    except Exception:
        return False

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
c = conn.cursor()

c.execute("SELECT user_id, username, email, password FROM users")
rows = c.fetchall()

print(f"Found {len(rows)} user(s) in database.\n")

fixed   = []
already = []
deleted = []

for row in rows:
    uid    = row["user_id"]
    uname  = row["username"]
    stored = row["password"] or ""

    if is_bcrypt_hash(stored):
        already.append(uname)
        print(f"  ✓ {uname:<20} — valid bcrypt hash, skipping")

    elif len(stored.encode("utf-8")) <= 72:
        # Plain-text that fits bcrypt limit — re-hash it
        new_hash = bcrypt.hashpw(stored.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        c.execute("UPDATE users SET password = ? WHERE user_id = ?", (new_hash, uid))
        fixed.append(uname)
        print(f"  ✓ {uname:<20} — re-hashed successfully")

    else:
        # Corrupted value (partial bcrypt hash stored as plain-text, > 72 bytes)
        # Cannot recover — delete the row, user must re-register
        c.execute("DELETE FROM users WHERE user_id = ?", (uid,))
        deleted.append(uname)
        print(f"  ✗ {uname:<20} — corrupted password, row DELETED (please re-register)")

conn.commit()
conn.close()

print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Already valid  : {len(already)} — {already}
Re-hashed      : {len(fixed)}   — {fixed}
Deleted        : {len(deleted)} — {deleted}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")

if deleted:
    print("Deleted users had a corrupted password (a partial bcrypt hash was")
    print("stored as plain-text). Please re-register those accounts fresh.\n")

print("Done! Run: streamlit run app.py")