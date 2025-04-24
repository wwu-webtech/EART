from flask import Flask, request, jsonify
from flask_cors import CORS
from web_scrap import scrape_website

app = Flask(__name__)
CORS(app, resources={ r"/scrape": { "origins": "*" } })

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    scraped_data = scrape_website(url)
    return jsonify(scraped_data)


if __name__ == '__main__':
    app.run(debug=True)
