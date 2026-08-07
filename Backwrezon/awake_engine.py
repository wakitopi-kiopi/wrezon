import requests
import time
def call_wrezonAPI():
    def call_wrezon():
        try:
            url = "https://wrezon.onrender.com/wakepoint"
            
            response = requests.post(url=url,timeout=30)
            
            
            if response.status_code ==200:
                status = response.json()
                print("wrezon is alive")
                print(status)
        except Exception as e:
            print("wrezon took too long")
            print(e)
    while True:
        call_wrezon()
        time.sleep(300)
call_wrezonAPI() 
