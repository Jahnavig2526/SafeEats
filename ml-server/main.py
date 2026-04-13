from __future__ import annotations

from functools import lru_cache
from typing import Dict, List, Tuple

import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.models import ResNet50_Weights, resnet50

app = FastAPI(title="SafeEats Ingredient ML API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://172.250.18.142:8081",
        "http://localhost",
        "http://127.0.0.1",
        "http://172.250.18.142",
        "exp://172.250.18.142:8081",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


INGREDIENT_HINTS: Dict[str, List[str]] = {
    "pizza": ["wheat flour", "tomato", "cheese", "olive oil", "oregano"],
    "burger": ["bun", "beef patty", "lettuce", "onion", "cheese"],
    "hotdog": ["bread", "sausage", "mustard", "ketchup"],
    "sandwich": ["bread", "lettuce", "cheese", "tomato"],
    "salad": ["lettuce", "cucumber", "tomato", "olive oil"],
    "burrito": ["tortilla", "rice", "beans", "cheese"],
    "guacamole": ["avocado", "onion", "lime", "cilantro"],
    "soup": ["water", "salt", "vegetables", "spices"],
    "carbonara": ["pasta", "egg", "cheese", "black pepper"],
    "spaghetti": ["pasta", "tomato", "garlic", "olive oil"],
    "lasagna": ["pasta sheets", "tomato", "cheese", "ground meat"],
    "ramen": ["noodles", "broth", "soy sauce", "egg"],
    "noodle": ["wheat", "salt", "oil", "seasoning"],
    "rice": ["rice", "salt", "oil"],
    "paella": ["rice", "seafood", "saffron", "vegetables"],
    "sushi": ["rice", "seaweed", "fish", "vinegar"],
    "omelet": ["egg", "butter", "salt", "pepper"],
    "pancake": ["flour", "milk", "egg", "sugar"],
    "waffle": ["flour", "milk", "egg", "butter"],
    "ice cream": ["milk", "cream", "sugar", "flavoring"],
    "cheeseburger": ["bun", "beef patty", "cheese", "onion"],
    "dough": ["flour", "water", "yeast", "salt"],
    "chocolate": ["cocoa", "sugar", "milk"],
    "cake": ["flour", "egg", "sugar", "butter"],
    "apple pie": ["apple", "flour", "butter", "sugar"],
    "potpie": ["flour", "chicken", "vegetables", "butter"],
    "falafel": ["chickpeas", "parsley", "garlic", "spices"],
    "hummus": ["chickpeas", "tahini", "lemon", "garlic"],
    "broccoli": ["broccoli", "olive oil", "salt"],
    "cauliflower": ["cauliflower", "olive oil", "salt"],
    "carrot": ["carrot", "salt", "oil"],
    "mushroom": ["mushroom", "salt", "pepper"],
    "corn": ["corn", "butter", "salt"],
    "strawberry": ["strawberry"],
    "banana": ["banana"],
    "orange": ["orange"],
    "grape": ["grape"],
}

DEFAULT_INGREDIENTS = ["water", "salt", "vegetable oil", "spices"]


@lru_cache(maxsize=1)
def load_model() -> Tuple[torch.nn.Module, transforms.Compose, List[str]]:
    weights = ResNet50_Weights.DEFAULT
    model = resnet50(weights=weights)
    model.eval()
    preprocess = weights.transforms()
    categories = list(weights.meta["categories"])
    return model, preprocess, categories


def infer_ingredients_from_label(label: str) -> List[str]:
    lowered = label.lower()
    for keyword, ingredients in INGREDIENT_HINTS.items():
        if keyword in lowered:
            return ingredients
    return DEFAULT_INGREDIENTS


def run_inference(image_bytes: bytes) -> dict:
    model, preprocess, categories = load_model()

    try:
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image: {exc}") from exc

    tensor = preprocess(pil_image).unsqueeze(0)

    with torch.inference_mode():
        logits = model(tensor)
        probabilities = torch.softmax(logits, dim=1)[0]

    top_probs, top_indices = torch.topk(probabilities, k=5)
    top_predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        label = categories[idx]
        top_predictions.append({"label": label, "confidence": round(prob * 100, 2)})

    primary_label = top_predictions[0]["label"]
    ingredients = infer_ingredients_from_label(primary_label)

    return {
        "foodLabel": primary_label,
        "confidence": top_predictions[0]["confidence"],
        "ingredients": ingredients,
        "topPredictions": top_predictions,
    }


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "safeeats-ingredient-ml"}


@app.post("/predict-ingredients")
async def predict_ingredients(file: UploadFile = File(...)) -> dict:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    return run_inference(image_bytes)
