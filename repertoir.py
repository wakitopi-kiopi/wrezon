from yt_dlp import YoutubeDL
import yt_dlp
import urllib.request
import requests

from dotenv import load_dotenv
import os

load_dotenv()

data_key=os.getenv("youtube_data_api")

def video_search_engine(query):  
    url = "https://www.googleapis.com/youtube/v3/search"
        
    params = {
        "key":data_key,
        "q":query,
        "part":"snippet",
        "maxResults": 10,
        "type":"video",
        "videoEmbeddable": True
    }
        
    response = requests.get(url,params=params)

    complete_id_set = [] 
    colect_vid_data = []  
    if response.status_code == 200:
        data = response.json()
        for item in data.get('items'):
            
            video_id = item.get('id').get('videoId')
            video_thumbnails = item.get('snippet',{}).get('thumbnails',{}).get('medium',{}).get('url',"")
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            
            
            
            colected_video_package = {
                "video_id":video_id,
                "video_url":video_url,
                "video_thumbnail":video_thumbnails
                }
            colect_vid_data.append(colected_video_package)
                    
    return{"url_list":colect_vid_data}





    



    
    