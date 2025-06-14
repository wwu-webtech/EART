from flask import Flask, request, jsonify
from flask_cors import CORS
from web_scrap import scrape_website
import os
import sys
import socket 

app = Flask(__name__)

CORS(app,
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "OPTIONS"])

@app.route('/scrape', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        # Handle preflight requests
        return '', 200
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data or 'url' not in data:
                return jsonify({"error": "URL is required in JSON payload"}), 400

            url_to_scrape = data['url']
            if not url_to_scrape: # Should be caught by client-side or earlier check, just in case
                return jsonify({"error": "URL cannot be empty"}), 400

            # ... your scraping logic ...
            report_data = scrape_website(url_to_scrape)
            return jsonify(report_data), 200

        except Exception as e:
            print(f"Error during scraping: {str(e)}", file=sys.stderr, flush=True) # Log to stderr
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405

def find_available_port(start_port, host='127.0.0.1', max_tries=100):
    """Finds an available port by trying to bind to it."""
    for i in range(max_tries):
        port = start_port + i
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((host, port))
                return port  # Port is available
        except OSError as e:
            if e.errno == 98: # Address already in use (Linux/macOS)
                print(f"Port {port} is in use, trying next.", file=sys.stderr, flush=True)
                continue
            elif e.errno == 10048: # Address already in use (Windows)
                 print(f"Port {port} is in use, trying next.", file=sys.stderr, flush=True)
                 continue
            else:
                raise # Other OSError
    raise RuntimeError(f"Could not find an available port after {max_tries} tries starting from {start_port}")


if __name__ == '__main__':
    default_port = int(os.environ.get('PORT', 5001))
    
    actual_port = default_port
    try:
        actual_port = find_available_port(default_port)
    except RuntimeError as e:
        print(f"Error finding available port: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

    is_bundled = getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS')

    # Print the port Flask will run on to stdout for Electron to capture
    # needs to print before app.run
    print(f"FLASK_RUNNING_ON_PORT={actual_port}", flush=True)

    print(f"--- Flask backend attempting to start on http://127.0.0.1:{actual_port} ---", file=sys.stderr, flush=True)
    print(f"--- Running as bundled app: {is_bundled} ---", file=sys.stderr, flush=True)
    print(f"--- Debug mode: {not is_bundled} ---", file=sys.stderr, flush=True)
    
    try:
        app.run(debug=(not is_bundled), host='0.0.0.0', port=actual_port, use_reloader=(not is_bundled))
    except OSError as e:
        # This might catch the "Address already in use" if find_available_port somehow missed it,
        # or if the port got taken between find_available_port and app.run
        print(f"Flask app.run failed: {e}", file=sys.stderr, flush=True)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred during Flask app.run: {e}", file=sys.stderr, flush=True)
        sys.exit(1)