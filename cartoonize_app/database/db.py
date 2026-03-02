import sqlite3
import os

# ── Resolve path relative to THIS file, not the working directory ──────────
# db.py lives at:  cartoonize_app/database/db.py
# DB should be at: cartoonize_app/cartoonize.db  (same folder as app.py)
_HERE   = os.path.dirname(os.path.abspath(__file__))          # .../database/
_ROOT   = os.path.dirname(_HERE)                               # .../cartoonize_app/
DB_PATH = os.path.join(_ROOT, "cartoonize.db")


def get_connection():
    """Primary connection function — also aliased as get_conn."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


get_conn = get_connection   # backward-compat alias


def init_db():
    conn = get_connection()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT    UNIQUE NOT NULL,
            email      TEXT    UNIQUE NOT NULL,
            password   TEXT    NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    """)

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

    c.execute("""
        CREATE TABLE IF NOT EXISTS Transactions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            type       TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)

    conn.commit()
    conn.close()