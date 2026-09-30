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
    
#picImage("photosynthesis")
            