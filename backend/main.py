from flask import Flask, request, jsonify
from flask_cors import CORS
from web_scrap import scrape_website
import os
import sys

app = Flask(__name__)

CORS(app,
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "OPTIONS"])

@app.route('/scrape', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        return '', 200
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data or 'url' not in data:
                return jsonify({"error": "URL is required in JSON payload"}), 400

            url_to_scrape = data['url']
            if not url_to_scrape:
                return jsonify({"error": "URL cannot be empty"}), 400

            report_data = scrape_website(url_to_scrape)
            return jsonify(report_data), 200

        except Exception as e:
            print(f"Error during scraping: {str(e)}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    # Determine if running in a PyInstaller bundle
    # debug=False if bundled, otherwise True for local development
    is_bundled = getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS')

    print(f"--- Flask backend attempting to start on http://127.0.0.1:{port} ---")
    print(f"--- Running as bundled app: {is_bundled} ---")
    print(f"--- Debug mode: {not is_bundled} ---")

    app.run(debug=(not is_bundled), host='0.0.0.0', port=port, use_reloader=(not is_bundled))