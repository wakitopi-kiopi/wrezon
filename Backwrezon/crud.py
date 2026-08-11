import tableModels
from sqlalchemy import select ,or_
import os
from dotenv import load_dotenv
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from huggingface_hub import InferenceClient


load_dotenv()

hf_key1=os.getenv("hf_wren1")
hf_key2=os.getenv("hf_wren2")
hf_key3=os.getenv("hf_wren3")
model_name = "BAAI/bge-small-en-v1.5"

keys = (hf_key1,hf_key2,hf_key3)


#model = SentenceTransformer('sentence-transformers/all-MiniLM-l6-v2')


def add_new_user(user_info,db):
    new_user = tableModels.user_login_db(name=user_info.name,
                                         passcode=user_info.passcode,
                                         country=user_info.country,
                                         userLine=user_info.userLine)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return{"message":"user successfuly created",
           "user":{
               "name":user_info.name,
               "country":user_info.country,
               "userline":user_info.userLine
           }}
    
    
def user_registration(registration_data,db):
    registering_user =tableModels.new_user_registration_Base(name=registration_data.name,
                                                             DoB=registration_data.DoB,
                                                             phoneNumber=registration_data.phoneNumber,
                                                             email=registration_data.email,
                                                             gender=registration_data.gender,
                                                             confirmedPassword=registration_data.confirmedPassword)
    db.add(registering_user)
    db.commit()
    db.refresh(registering_user)
    
    return{'message from user Registration Route':'successfully registerd',
           "name":registration_data.name,
           'DoB':registration_data.DoB,
           'phoneNumber':registration_data.phoneNumber,
           'email':registration_data.email,
           'gender':registration_data.gender,
           'confirmedPassword':registration_data.confirmedPassword,
           
           }

def get_vector(query: list[str]):
    """Accepts a list of titles and returns a list of flat 1D vectors."""
    if not query:
        return []

    for key in keys:
        try:
            client = InferenceClient(token=key)
            raw_response = client.feature_extraction(query, model=model_name)
            
            clean_vectors = []
            for item in raw_response:
                data = item
                
                # 1. Unwrap extra nested batch brackets if present [[[...]]]
                while isinstance(data, list) and len(data) == 1 and isinstance(data[0], list):
                    data = data[0]

                # 2. Mean-pool token vectors [[tok1], [tok2]] -> [single_flat_vec]
                if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
                    num_tokens = len(data)
                    vector_dim = len(data[0])
                    data = [
                        sum(data[token_idx][dim_idx] for token_idx in range(num_tokens)) / num_tokens
                        for dim_idx in range(vector_dim)
                    ]

                clean_vectors.append(data)

            return clean_vectors

        except Exception as e:
            print("HuggingFace key error:", e)

    raise Exception("All HuggingFace keys failed")
                



def add_and_retrieve(incoming_online_data, db):
    try:
        titles = [video.get('video_title') for video in incoming_online_data]
        
        new_vectors =get_vector(titles)
        # ----------------------------------------------------
        # STEP 1: Prepare vectors and build incoming records
        # ----------------------------------------------------
        records_to_save = []
        incoming_ids = []
        quick_data_to_return = []
        
        for video, video_vector in zip(incoming_online_data, new_vectors):
            #zip makes it possible to match the two lists on the fly,
            # for video in incoming_online_data give it a vector temporary variable and put in a vector we are o.
            v_id = video.get('video_id')
            v_title = video.get('video_title')
            v_thumb = video.get('video_thumbnail_url')
            v_embed = video.get('video_embed_url')

            records_to_save.append({
                "video_id": v_id,
                "video_title": v_title,
                "video_thumbnail_url": v_thumb,
                "video_embed_url": v_embed,
                "video_vector_embed": video_vector
            })

            quick_data_to_return.append({
                "video_id": v_id,
                "video_title": v_title,
                "video_thumbnail_url": v_thumb,
                "video_embed_url": v_embed
            })
        if not records_to_save:
            return []

        # ----------------------------------------------------
        # STEP 2: INSERT into DB (DO NOTHING if duplicate)
        # ----------------------------------------------------
        insert_stmt = insert(tableModels.YouTubeCacheDb).values(records_to_save)
        
        # Tell Postgres: "If video_id exists, skip it!"
        insert_stmt = insert_stmt.on_conflict_do_nothing(
            index_elements=['video_id']
        )
        
        db.execute(insert_stmt)
        db.commit()

        # ----------------------------------------------------
        # STEP 3: SELECT and return saved videos back
        return quick_data_to_return[:5]

    except Exception as e:
        db.rollback()  # Safely resets DB session if network drops
        print("Error during add_and_retrieve:", e)
        return {"error": str(e)}
    
   
def get_vector_for_query(query:str):
    """Accepts a list of titles, sends"""
    
    for key in keys:
        try:
            client = InferenceClient(token=key)
            data = client.feature_extraction(query, model=model_name)
        
            return data[0] if isinstance(data,list) and isinstance(data[0],list) else data
        except Exception as e:
            print("error",(e))
    raise Exception("hf keys failed")
             
def semantic_data_retriaval(data,db):
    query_vector = get_vector_for_query(data)
    pointer = tableModels.YouTubeCacheDb.video_vector_embed.cosine_distance(query_vector)
    
    search_db = (select(tableModels.YouTubeCacheDb)
                 .order_by(pointer)
                 .where(pointer<=0.2)
                 .limit(5))
    formated_data = db.execute(search_db)
    formated_response = formated_data.mappings().all()
    return formated_response 