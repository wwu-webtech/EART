from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from web_scrap import scrape_website

app = Flask(__name__)
# allow CORS on everything
CORS(app, supports_credentials=True)

@app.route('/scrape', methods=['POST', 'OPTIONS'])
@cross_origin()
def scrape():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    scraped_data = scrape_website(url)
    return jsonify(scraped_data)


if __name__ == '__main__':
    app.run(debug=True)