import requests
from dotenv import load_dotenv
import os

load_dotenv()

pixakey = os.getenv("pixakey")
unsplashkey = os.getenv("UNSPLASH_ACCESS_KEY")

def picImage(query):

    urls = "https://pixabay.com/api/"  #pixabay url 
    url = "https://api.unsplash.com/search/photos"
    try:
        params = {
            "key":pixakey,
            "q":query,
            "image_type":"photo",
            "page":2
            
        }
        
        response = requests.get(url=urls,params=params,timeout=60)
        
        imageData = response.json()
        imageBunchs = imageData.get("hits")
        
        returned_urls = []
        unsplash_urls = []
        
        for singleIBunch in imageBunchs:
            image_url = singleIBunch.get("webformatURL")
            returned_urls.append(image_url)
        #print(returned_urls) 
        

        headers = {
            "Authorization": f"Client-ID {unsplashkey}"
        }

        params = {
            #"key":unsplashkey,
            "query": query,
            "per_page": 15,
            "page": 1,
            "orientation": "landscape",
            
        }

        response = requests.get(url, headers=headers, params=params, timeout=30)
        data = response.json()

        # Access results array
        photos = data.get("results", [])
        for photo in photos:
            urls_dict = photo.get("urls", {})
            image_url = urls_dict.get("regular")
            if image_url:
                unsplash_urls.append(image_url)
        
        returnedUrls =returned_urls[:3]
        unsplashUrls = unsplash_urls[:3]
        completeUrls = []
        for imgs in unsplashUrls:
            completeUrls.append(imgs)
        for img in returnedUrls:
            completeUrls.append(img)
        
            
            
        return completeUrls
        
        #print(response.status_code)
    except Exception as e:
        print("error in image algo",(e))
        print(response.status_code)
        return []
    

PIXABAY_KEY  = os.getenv("pixakey")
UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

# ---- Endpoints ----
PIXABAY_URL          = "https://pixabay.com/api/"
UNSPLASH_SEARCH_URL  = "https://api.unsplash.com/search/photos"
UNSPLASH_TRENDING_URL = "https://api.unsplash.com/photos"

DEFAULT_PER_PAGE = 20
TIMEOUT = 30


def _pixabay(page, per_page):
    try:
        params = {
            "key": PIXABAY_KEY,
            "q": "trendiing",
            "image_type": "photo",
            "page": page,
            "per_page": per_page,
            "safesearch": "true",
        }
        r = requests.get(PIXABAY_URL, params=params, timeout=TIMEOUT)
        r.raise_for_status()
        return [
            h["webformatURL"]
            for h in r.json().get("hits", [])
            if h.get("webformatURL")
        ]
    except Exception as e:
        print("pixabay error:", e)
        return []


def _unsplash(page, per_page):
    try:
        headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}"}
        params = {
            "query": "trending",
            "per_page": per_page,
            "page": page,
            "orientation": "landscape",
        }
        r = requests.get(UNSPLASH_SEARCH_URL, headers=headers,
                         params=params, timeout=TIMEOUT)
        r.raise_for_status()
        return [
            p["urls"]["regular"]
            for p in r.json().get("results", [])
            if p.get("urls", {}).get("regular")
        ]
    except Exception as e:
        print("unsplash error:", e)
        return []


def _pixabay_trending(page, per_page):
    try:
        params = {
            "key": PIXABAY_KEY,
            "image_type": "photo",
            "order": "popular",
            "page": page,
            "per_page": per_page,
            "safesearch": "true",
        }
        r = requests.get(PIXABAY_URL, params=params, timeout=TIMEOUT)
        r.raise_for_status()
        return [
            h["webformatURL"]
            for h in r.json().get("hits", [])
            if h.get("webformatURL")
        ]
    except Exception as e:
        print("pixabay trending error:", e)
        return []


def _unsplash_trending(page, per_page):
    try:
        headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}"}
        params = {"per_page": per_page, "page": page, "order_by": "popular"}
        r = requests.get(UNSPLASH_TRENDING_URL, headers=headers,
                         params=params, timeout=TIMEOUT)
        r.raise_for_status()
        return [
            p["urls"]["regular"]
            for p in r.json()
            if p.get("urls", {}).get("regular")
        ]
    except Exception as e:
        print("unsplash trending error:", e)
        return []


def _interleave(a, b):
    out = []
    for i in range(max(len(a), len(b))):
        if i < len(a):
            out.append(a[i])
        if i < len(b):
            out.append(b[i])
    return out


def get_image_urls(page=1, per_page=DEFAULT_PER_PAGE):
    """
    Return a list of image URLs.

    - query empty  -> trending from both sources
    - query non-empty -> search results from both sources
    - page is 1-based; increment to paginate
    - returns [] on any failure or when out of results
    """
    if not PIXABAY_KEY and not UNSPLASH_KEY:
        print("no API keys found in environment")
        return []

    if page:
        unsplash = _unsplash( page, per_page) if UNSPLASH_KEY else []
        pixabay  = _pixabay( page, per_page)  if PIXABAY_KEY  else []
    else:
        unsplash = _unsplash_trending(page, per_page) if UNSPLASH_KEY else []
        pixabay  = _pixabay_trending(page, per_page)  if PIXABAY_KEY  else []

    return _interleave(unsplash, pixabay)