#!/usr/bin/env python3
"""
Quantum Factory Game Server
Runs the game locally using a simple HTTP server
"""

import os
import sys
import webbrowser
import http.server
import socketserver
from urllib.parse import urljoin

class GameHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the game server"""
    
    def end_headers(self):
        # Add headers to prevent caching issues during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging format
        print(f"[GAME SERVER] {format % args}")

def find_available_port(start_port=8000, max_attempts=10):
    """Find an available port starting from start_port"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"Could not find an available port in range {start_port}-{start_port + max_attempts}")

def start_game_server(port=None, auto_open=True):
    """Start the game server"""
    # Change to the directory containing the game files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Find available port if not specified
    if port is None:
        port = find_available_port()
    
    # Create server
    handler = GameHTTPRequestHandler
    httpd = socketserver.TCPServer(("localhost", port), handler)
    
    game_url = f"http://localhost:{port}/index.html"
    
    print("=" * 60)
    print("🚀 QUANTUM FACTORY GAME SERVER")
    print("=" * 60)
    print(f"✓ Server running on: http://localhost:{port}")
    print(f"✓ Game URL: {game_url}")
    print(f"✓ Test URL: http://localhost:{port}/test.html")
    print("=" * 60)
    print("📁 Serving files from:", script_dir)
    print("🎮 Game is ready to play!")
    print("⏹️  Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Auto-open browser if requested
    if auto_open:
        print("🌐 Opening game in default browser...")
        try:
            webbrowser.open(game_url)
        except Exception as e:
            print(f"⚠️  Could not auto-open browser: {e}")
            print(f"   Please manually open: {game_url}")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("🛑 Shutting down game server...")
        httpd.shutdown()
        print("✓ Server stopped successfully")
        print("Thanks for playing Quantum Factory! 🎮")
        print("=" * 60)

def main():
    """Main function with command line argument handling"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Run the Quantum Factory incremental game locally",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_game.py                    # Start server on auto-detected port
  python run_game.py --port 3000       # Start server on port 3000
  python run_game.py --no-browser      # Don't auto-open browser
  python run_game.py --port 8080 --no-browser  # Custom port, no auto-open
        """
    )
    
    parser.add_argument(
        '--port', '-p',
        type=int,
        default=None,
        help='Port number to run the server on (auto-detect if not specified)'
    )
    
    parser.add_argument(
        '--no-browser', '-n',
        action='store_true',
        help='Do not automatically open the game in browser'
    )
    
    args = parser.parse_args()
    
    try:
        start_game_server(
            port=args.port,
            auto_open=not args.no_browser
        )
    except KeyboardInterrupt:
        print("\nGame server interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting game server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 