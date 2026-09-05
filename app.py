"""
=============================================================================
🌿 FarmFlow - Application Server (Backend Entrypoint)
=============================================================================
Delegates cleanly to the modular Python backend package in `backend/`:
- `backend/database.py`: Users, passwords, and produce catalog
- `backend/services.py`: Cart math, payment processor, auth logic
- `backend/routes.py`: API route handlers
- `backend/logger.py`: Event and transaction logger (activity.log)
- `backend/server.py`: Standalone HTTP server

To run:
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
