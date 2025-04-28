import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def scrape_website(url):
    # Send a GET request to the URL
    response = requests.get(url)
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract the name of the page and its title element
    page_title = soup.find('title').get_text()
    
    # Initialize dictionaries to hold headings by section
    headings_by_section = {
        'header': [],
        'main': [],
        'footer': []
    }
    
    # Extract and categorize headings
    def extract_headings(section, section_name):
        if section:
            headings = section.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            for heading in headings:
                headings_by_section[section_name].append({
                    'tag': heading.name,
                    'text': heading.text.strip(),
                    'parent_html': heading.parent.prettify()
                })

    # Extract headings from <header>, <main>, and <footer>
    header_section = soup.find('header')
    main_section = soup.find('main')
    footer_section = soup.find('footer')
    
    extract_headings(header_section, 'header')
    extract_headings(main_section, 'main')
    extract_headings(footer_section, 'footer')
    
    # If no <header>, <main>, and <footer> are found, extract from the whole document
    if not header_section and not main_section and not footer_section:
        headings_by_section = {
            'document': []
        }
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        for heading in headings:
            headings_by_section['document'].append({
                'tag': heading.name,
                'text': heading.text.strip(),
                'parent_html': heading.parent.prettify()
            })
    
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

    # Parse the URL and keep only the base domain
    parsed_url = urlparse(url)
    base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
    
    return {
        'url': url,
        'base_domain': base_domain,
        'page_title': page_title,
        'headings_by_section': headings_by_section,
        'image_alt_text': image_alt_text,
        'videos': videos,
    }