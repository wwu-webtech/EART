# accessibility_scorer.py

def calculate_accessibility_scores(heading_structure, image_alt_text, page_title):
    """
    Calculate accessibility scores based on heading structure, image alt text, and page title.
    """
    accessibility_scores = {
        'alt_text': 0,
        'heading_structure': 0,
        'page_title': 0
    }
    
    # Calculate accessibility score for alt text
    total_images = len(image_alt_text)
    images_with_alt_text = sum(1 for src, alt in image_alt_text if alt)
    accessibility_scores['alt_text'] = (images_with_alt_text / total_images) * 100 if total_images > 0 else 100
    
    # Calculate accessibility score for heading structure
    total_headings = len(heading_structure)
    h1_count = sum(1 for tag, text in heading_structure if tag == 'h1')
    accessibility_scores['heading_structure'] = (h1_count / total_headings) * 100 if total_headings > 0 else 0
    
    # Calculate accessibility score for page title
    accessibility_scores['page_title'] = 100 if page_title else 0
    
    return accessibility_scores
