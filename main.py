"""
=============================================================================
🌿 FarmFlow - Main Backend Entrypoint
=============================================================================
Runs the modular Python backend server located in the 'backend/' folder.
Usage:
    python main.py
    # or:
    python app.py
=============================================================================
"""

import sys
from backend.server import start_backend_server

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    start_backend_server(port)
