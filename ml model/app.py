from fastapi import FastAPI
import pickle

app = FastAPI()

# Load model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
mlb = pickle.load(open("mlb.pkl", "rb"))

@app.get("/")
def home():
    return {"message": "SafeEats AI API Running"}

@app.post("/predict")
def predict(data: dict):
    text = data["ingredients"]
    
    vec = vectorizer.transform([text])
    pred = model.predict(vec)
    
    allergens = mlb.inverse_transform(pred)
    
    return {"allergens": allergens[0]}