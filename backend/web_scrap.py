import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def analyze_headings(section, section_name, existing_h1_count):
    headings = []
    last_level = 0

    if section:
        found = section.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        for h in found:
            # slice everything after the h so we get the heading level
            level = int(h.name[1:])
            issue = None
            # check if theres multiple h1 tags
            if level == 1:
                existing_h1_count[0] += 1
                if existing_h1_count[0] > 1:
                    issue = f"Multiple H1 tags found"
            # check for level skips
            if last_level and level > last_level + 1:
                issue = "Skipped heading level"
            # add the current heading to the heading object list
            headings.append({
                "section": section_name,
                "issue": issue,
                "level": level,
                "text": h.get_text(strip=True),
                "parent_html": h.parent.prettify()
            })
            last_level = level

        return headings

def extract_images(soup):
    images = []
    for img in soup.find_all('img'):
        images.append({
            "src": img.get('src'),
            "alt": img.get('alt')
        })
    return images

def extract_videos(soup):
    #list of common video sites, so we can filter for just 
    #video sites and not ads, google maps, other websites
    commonVideo = ['youtube', 'vimeo', 'facebook', 'tiktok', 'reddit',
                     'imgur', 'twitch', 'dailymotion', 'ted', 'instagram',
                     'google drive']
    videos = []
    for vid in soup.find_all('video'):
        videos.append({
            "src": vid.get('src'),
            "alt": vid.get('alt')
        })
    #look for iframe videos
    for iframe in soup.find_all('iframe'):
        src = iframe.get('src', '')
        if any(domain in src for domain in commonVideo):
            videos.append({
                "src": src,
                "title": iframe.get('title')
            })
    return 

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    #page title
    title_tag = soup.find('title')
    if title_tag:
        page_title = soup.get_text(strip=True)
    else:
        page_title = ""
    
    existing_h1_count = [0]
    headings = []
    for section_name in ['header', 'main', 'footer']:
        section = soup.find(section_name)
        headings += analyze_headings(section, section_name, existing_h1_count)
    #if above yields no headings, sections arent defined, so scan entire document
    if not headings:
        headings = analyze_headings(soup, 'document', existing_h1_count)
    
    images = extract_images(soup)
    videos = extract_videos(soup)

    parsed_url = urlparse(url)
    base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
    page_path = f"{parsed_url.path}"

    return {
        "url": url,
        "base_domain": base_domain,
        "page_title": page_title,
        "page_path": page_path,
        "headings": headings,
        "images": images,
        "videos": videos,
    }

    