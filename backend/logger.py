"""
=============================================================================
🌿 FarmFlow - Backend Activity Logger (سجل العمليات والـ Logs)
=============================================================================
This file handles logging all server events, user authentication (logins),
and payment transactions into both the terminal and a dedicated log file:
'backend/activity.log'
=============================================================================
"""

import os
from datetime import datetime

LOG_FILE_PATH = os.path.join(os.path.dirname(__file__), "activity.log")

def log_event(category, message, level="INFO"):
    """
    Logs an event with timestamp, category, and severity level.
    Writes to both console and activity.log.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line = f"[{timestamp}] [{level}] [{category}] {message}\n"

    # 1. Print to console with nice emoji formatting
    emoji = "ℹ️"
    if category == "AUTH":
        emoji = "🔐"
    elif category == "PAYMENT":
        emoji = "💳"
    elif category == "ORDER":
        emoji = "📦"
    elif category == "CART":
        emoji = "🛒"
    elif level == "ERROR":
        emoji = "❌"

    print(f"{emoji} {log_line.strip()}")

    # 2. Append to log file
    try:
        with open(LOG_FILE_PATH, "a", encoding="utf-8") as f:
            f.write(log_line)
    except Exception as e:
        print(f"Warning: could not write to {LOG_FILE_PATH}: {e}")

def get_recent_logs(limit=20):
    """Returns the most recent log entries."""
    if not os.path.exists(LOG_FILE_PATH):
        return []
    try:
        with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
            lines = f.readlines()
            return lines[-limit:]
    except Exception:
        return []
