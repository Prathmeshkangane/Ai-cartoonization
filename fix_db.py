"""
fix_db.py
Run this ONCE from your project root to fix the stale database schema.

Usage:
    python fix_db.py

What it does:
  1. Connects to cartoonize.db (same path db.py uses)
  2. Shows you the current columns in `users`
  3. If `password` column is missing, recreates the table correctly
  4. Also ensures image_history and Transactions tables are up-to-date
"""

import sqlite3
import os

# ── Resolve the same DB path that db.py uses ──────────────────────────────
# db.py lives at:  cartoonize_app/database/db.py
# DB file is at:   cartoonize_app/../cartoonize.db  (one level up from db.py)
# Run this script from the project root (where app.py lives).

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(SCRIPT_DIR, "cartoonize.db")

print(f"Database path: {DB_PATH}")
print(f"File exists  : {os.path.exists(DB_PATH)}\n")

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
c = conn.cursor()

# ── 1. Show current schema ────────────────────────────────────────────────
c.execute("PRAGMA table_info(users)")
cols = c.fetchall()
if cols:
    print("Current `users` columns:", [col["name"] for col in cols])
else:
    print("`users` table does not exist yet.")

# ── 2. Check if password column exists ───────────────────────────────────
col_names = [col["name"] for col in cols]

if "password" not in col_names:
    print("\n`password` column is MISSING — recreating `users` table...\n")

    # Rename old table so we don't lose any existing rows
    c.execute("ALTER TABLE users RENAME TO users_old")

    # Create correct table
    c.execute("""
        CREATE TABLE users (
            user_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT    UNIQUE NOT NULL,
            email      TEXT    UNIQUE NOT NULL,
            password   TEXT    NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    """)

    # Migrate any existing rows — map old `password_hash` or `pass` if they exist
    c.execute("PRAGMA table_info(users_old)")
    old_cols = [col["name"] for col in c.fetchall()]
    print("Old columns:", old_cols)

    # Try to copy rows if compatible columns exist
    shared = [col for col in ["username", "email", "created_at", "last_login"] if col in old_cols]

    # Find old password column name (common variants)
    old_pw_col = next(
        (col for col in old_cols if col in ("password_hash", "pass", "pwd", "hashed_password")),
        None
    )

    if old_pw_col and shared:
        cols_to_copy = shared + [old_pw_col]
        target_cols  = shared + ["password"]
        c.execute(f"""
            INSERT INTO users ({', '.join(target_cols)})
            SELECT {', '.join(cols_to_copy)} FROM users_old
        """)
        print(f"Migrated existing rows using old column `{old_pw_col}` → `password`")
    elif shared:
        # Can't copy password — rows will be lost (user must re-register)
        print("WARNING: Could not find a matching password column in old table.")
        print("Existing user rows were NOT migrated — users will need to re-register.")
    else:
        print("Old table was empty or incompatible — nothing to migrate.")

    # Drop the old table
    c.execute("DROP TABLE users_old")
    print("\n`users` table recreated successfully ✓")

else:
    print("\n`password` column already exists — no changes needed ✓")

# ── 3. Ensure image_history table is correct ─────────────────────────────
c.execute("""
    CREATE TABLE IF NOT EXISTS image_history (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id              INTEGER NOT NULL,
        original_image_path  TEXT,
        processed_image_path TEXT,
        style_applied        TEXT,
        processing_date      DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
""")
print("image_history table: OK ✓")

# ── 4. Ensure Transactions table is correct ──────────────────────────────
c.execute("""
    CREATE TABLE IF NOT EXISTS Transactions (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL,
        type       TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
""")
print("Transactions  table: OK ✓")

conn.commit()
conn.close()

# ── 5. Final verification ─────────────────────────────────────────────────
conn2 = sqlite3.connect(DB_PATH)
conn2.row_factory = sqlite3.Row
c2 = conn2.cursor()
c2.execute("PRAGMA table_info(users)")
final_cols = [col["name"] for col in c2.fetchall()]
conn2.close()

print(f"\nFinal `users` columns: {final_cols}")
print("\nAll done! You can now run: streamlit run app.py")