import requests
from dotenv import load_dotenv
import os


load_dotenv()
APIkey = os.getenv("youtube_data_api")

#query = "the human evolution"
def video_search_engine(query):
    dataset = []
    ids = []

    print("init running")
    try:
        
        url_to_search = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part":'snippet',
            "q":query,
            "key":APIkey,
            "maxResults":50,
            "type":'video'
            
        }
        response = requests.get(url_to_search,params=params)
        
        def extraction1():
            print("extraction1 initialized")
            if response.status_code == 200:
                data = response.json()
                items = data.get('items')
                for item in items:
                    video_id = item.get('id',{}).get('videoId',"")
                    ids.append(video_id)
                    
                
        extraction1()
    except Exception as e:
        print(f"something went wrong check network and quoata",(e))
        return;
     
    try:
        def comlpete_data():
            print("id search initialixed")
            video_url_to_search = "https://www.googleapis.com/youtube/v3/videos"

            all_ids_string = ",".join(ids)

            params_2 = {
                "key":APIkey,
                "id":all_ids_string,
                "part":"snippet,status,contentDetails"
            }

            video_url_to_search_response = requests.get(video_url_to_search,params=params_2)
        
    
            if video_url_to_search_response.status_code == 200:
                print("response status == 200 OK")
                video_response = video_url_to_search_response.json()
                video_data = video_response.get('items')
                
                for video in video_data:
                    id = video.get('id')
                    
                    title = video.get('snippet').get('title',{})
                    thumbnai_url = video.get("snippet",{}).get("thumbnails",{}).get('medium',{}).get('url',"")
                    status = video.get('status',{}).get('embeddable',"")
                    
                    if status is True:
                        extracted_data = {
                            "video_id":id,
                            "video_title":title,
                            "video_thumbnail_url":thumbnai_url,
                            "video_embed_url":f"https://www.youtube.com/embed/{id}"
                        }
                        dataset.append(extracted_data)
                    
        comlpete_data()
    except Exception as e:
            print(f"something went wrong" ,(e))
            return;
    print(dataset)
    print("engine end")
    
            
                        
#video_search_engine()
    return dataset   

                
     
