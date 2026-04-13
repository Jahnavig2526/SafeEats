# SafeEats Ingredient ML Server

This service receives a food image and returns:
- predicted food label
- confidence score
- likely ingredient list
- top 5 model predictions

## 1) Setup

```bash
cd ml-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2) Run

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 3) API

- Health: `GET /health`
- Predict: `POST /predict-ingredients` with multipart field `file`

## 4) App integration

Set in app env:

`EXPO_PUBLIC_INGREDIENT_API_BASE_URL=http://localhost:8000`

For physical devices, replace `localhost` with your computer LAN IP.
