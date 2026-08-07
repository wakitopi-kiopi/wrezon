from sentence_transformers import SentenceTransformer

model = SentenceTransformer('sentence-transformers/all-MiniLM-l6-v2')

vector = model.encode('what is your name')

print(f"this is the vector for the query : {vector}")