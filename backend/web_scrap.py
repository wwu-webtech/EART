import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, unquote


def analyze_headings(section, section_name, existing_h1_count, index):
    headings = []
    last_level = 0
    issues = []

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
                    issue = "Multiple H1 tags found"
            # check for level skips
            if last_level and level > last_level + 1:
                issue = "Skipped heading level"
            if issue:
                issues.append({"issue": issue,
                               "index": index
                               })
            # add the current heading to the heading object list
            headings.append({
                "index": index,
                "section": section_name,
                "issue": issue,
                "level": level,
                "text": h.get_text(strip=True),
                "parent_html": h.parent.prettify()
            })
            index += 1
            last_level = level
    return headings, issues, index

def extract_images(soup):
    images = []
    imgnum = 1
    for img in soup.find_all('img'):
        images.append({
            "imgnum": (imgnum),
            "src": img.get('src'),
            "alt": img.get('alt')
        })
        imgnum += 1
    return images

def convert_youtube_watch_to_embed(watch_url):
    parsed = urlparse(watch_url)
    query = parse_qs(parsed.query)
    video_id = query.get('v', [None])[0]
    playlist_id = query.get('list', [None])[0]

    if not video_id:
        return None  # not a valid watch URL

    embed_url = f"https://www.youtube.com/embed/{video_id}"
    if playlist_id:
        embed_url += f"?list={playlist_id}"

    return embed_url

def extract_videos(soup):
    #list of common video sites, so we can filter for just 
    #video sites and not ads, google maps, other websites
    commonVideo = ['youtube', 'vimeo', 'facebook', 'tiktok', 'reddit',
                     'imgur', 'twitch', 'dailymotion', 'ted', 'instagram',
                     'google drive', 'wwu.edu/media/oembed']
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
            if 'wwu.edu/media/oembed' in src:
                parsed = urlparse(src)
                query = parse_qs(parsed.query)
                encoded_url = query.get('url', [None])[0]
                if encoded_url:
                    decoded_url = unquote(encoded_url)
                    src = decoded_url
                if 'youtube' in src:
                    src = convert_youtube_watch_to_embed(src)

            videos.append({
                "src": src,
                "title": iframe.get('title')
            })
    return videos

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    #page title
    title_tag = soup.find('title')
    if title_tag:
        page_title = title_tag.get_text(strip=True)
    else:
        page_title = ""
    
    existing_h1_count = [0]
    headings = []
    heading_issues = []
    index = 0
    for section_name in ['header', 'main', 'footer']:
        section = soup.find(section_name)
        sec_headings, sec_issues, index = analyze_headings(section, section_name, existing_h1_count, index)
        headings += sec_headings
        heading_issues += sec_issues
    #if above yields no headings, sections arent defined, so scan entire document
    if not headings:
        sec_headings, sec_issues, index = analyze_headings(soup, 'document', existing_h1_count, index)
        headings = sec_headings
        heading_issues = sec_issues
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
        "heading_issues": heading_issues,
        "images": images,
        "videos": videos,
    }