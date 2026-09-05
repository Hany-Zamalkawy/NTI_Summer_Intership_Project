"""
=============================================================================
🌿 FarmFlow - Standalone Python HTTP Server
=============================================================================
Hosts the FarmFlow backend API with CORS headers and serves the frontend.
Runs 100% on Python's built-in standard libraries with zero external dependencies.
=============================================================================
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from backend.routes import handle_api_get, handle_api_post
from backend.logger import log_event

class FarmFlowServerHandler(http.server.SimpleHTTPRequestHandler):
    """
    Handles GET, POST, and OPTIONS requests for FarmFlow.
    """

    def _send_cors_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        """Responds to browser pre-flight CORS requests."""
        self._send_cors_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. Route API requests
        if path.startswith("/api/"):
            status_code, data = handle_api_get(path)
            self._send_cors_headers(status_code, "application/json")
            self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))
            return

        # 2. Serve built React frontend from dist/ if available
        dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
        if os.path.exists(dist_dir):
            self.directory = dist_dir

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        if path.startswith("/api/"):
            status_code, data = handle_api_post(path, body)
            self._send_cors_headers(status_code, "application/json")
            self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))
            return

        self._send_cors_headers(404, "application/json")
        self.wfile.write(json.dumps({"error": "Route not found"}).encode("utf-8"))

def start_backend_server(port=8000):
    """Initializes and runs the HTTP server."""
    server_address = ("", port)
    log_event("SYSTEM", f"Starting FarmFlow Backend Server on port {port}...")
    with socketserver.TCPServer(server_address, FarmFlowServerHandler) as httpd:
        print("==================================================================")
        print(f"  🌿 FarmFlow Modular Python Backend running on port {port}")
        print(f"  👉 API Base URL: http://localhost:{port}/api")
        print("==================================================================")
        print("  Available API Endpoints:")
        print("    • GET  /api/products       (Catalog)")
        print("    • GET  /api/cart           (Shopping basket & totals)")
        print("    • POST /api/cart/update    (Update cart quantity)")
        print("    • GET  /api/orders         (Orders & past harvests)")
        print("    • POST /api/orders/pay     (Pay for Order & Invoice)")
        print("    • POST /api/orders/reorder (Reorder past harvest)")
        print("    • POST /api/login          (Authentication & passwords)")
        print("    • GET  /api/account        (User profile & stats)")
        print("    • GET  /api/logs           (Activity log records)")
        print("==================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down gracefully.")
