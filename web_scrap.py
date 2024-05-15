# web_scrap.py

import requests
from bs4 import BeautifulSoup
from accessibility_scorer import calculate_accessibility_scores

def scrape_website(url):
    # Send a GET request to the URL
    response = requests.get(url)
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract the name of the page and its title element
    page_title = soup.find('title').get_text()
    
    # Extract the heading structure of the page
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    heading_structure = [(heading.name, heading.text.strip()) for heading in headings]
    
    # Extract the alt text on each of the images on the page
    images = soup.find_all('img')
    image_alt_text = [(image['src'], image.get('alt')) for image in images]


    # Extract videos from direct <video> elements
    videos = []
    video_elements = soup.find_all('video')
    for video in video_elements:
        video_source = video.get('src')
        video_alt = video.get('alt')
        videos.append({'source': video_source, 'alt': video_alt})
    
    # Extract videos from embedded iframes
    iframe_elements = soup.find_all('iframe')
    for iframe in iframe_elements:
        # Check if the iframe contains a video source
        if 'youtube' in iframe['src']:
            video_id = iframe['src'].split('/')[-1]
            videos.append({'source': 'https://www.youtube.com/embed/' + video_id, 'alt': ''})
        elif 'vimeo' in iframe['src']:
            video_id = iframe['src'].split('/')[-1]
            videos.append({'source': 'https://player.vimeo.com/video/' + video_id, 'alt': ''})
        # Add other video hosting platforms as needed
        

    # Extract header, main, and footer contents
    header_content = soup.find('header').prettify() if soup.find('header') else None
    main_content = soup.find('main').prettify() if soup.find('main') else None
    footer_content = soup.find('footer').prettify() if soup.find('footer') else None
    
    return {
        'url': url,
        'page_title': page_title,
        'heading_structure': heading_structure,
        'image_alt_text': image_alt_text,
        'videos': videos,
    }
