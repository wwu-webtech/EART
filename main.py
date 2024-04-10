# main.py

from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
from accessibility_scorer import calculate_accessibility_scores

app = Flask(__name__)

def scrape_website(url):
    # Send a GET request to the URL
    response = requests.get(url)
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract the name of the page and its title element
    page_name = soup.find('title').get_text()
    page_title = soup.title.string
    
    # Extract the heading structure of the page
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    heading_structure = [(heading.name, heading.text.strip()) for heading in headings]
    
    # Extract the alt text on each of the images on the page
    images = soup.find_all('img')
    image_alt_text = [(image['src'], image.get('alt')) for image in images]
    
    # Calculate accessibility scores
    accessibility_scores = calculate_accessibility_scores(heading_structure, image_alt_text, page_title)
    
    return {
        'page_name': page_name,
        'page_title': page_title,
        'heading_structure': heading_structure,
        'image_alt_text': image_alt_text,
        'accessibility_scores': accessibility_scores
    }

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
