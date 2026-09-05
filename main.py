"""
FarmFlow - Main Entry Point
Run this file with: python main.py
"""

from app import run_server

if __name__ == "__main__":
    import sys
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
