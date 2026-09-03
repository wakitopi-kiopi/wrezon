import requests
from dotenv import load_dotenv
import os

load_dotenv()

pixakey = os.getenv("pixakey")

def picImage(query):

    urls = "https://pixabay.com/api/"  #pixabay url 
    try:
        params = {
            "key":pixakey,
            "q":query,
            "image_type":"photo",
            "page":1
            
            
            
        }
        
        response = requests.get(url=urls,params=params,timeout=60)
        
        imageData = response.json()
        imageBunchs = imageData.get("hits")
        
        returned_urls = []
        
        for singleIBunch in imageBunchs:
            image_url = singleIBunch.get("webformatURL")
            returned_urls.append(image_url)
        #print(returned_urls)   
        return returned_urls[3:5]
        
        #print(response.status_code)
    except Exception as e:
        print("error in image algo",(e))
        print(response.status_code)
        return
    
#picImage("photosynthesis")
            