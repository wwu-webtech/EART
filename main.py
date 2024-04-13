# main.py

from flask import Flask, render_template, request
from web_scrap import scrape_website

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('url')  # Get URL from form submission
        if url:
            # Scrape the website
            scraped_data = scrape_website(url)
            # Render template with scraped data
            return render_template('result.html', data=scraped_data)
        else:
            return "Please provide a URL."
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
