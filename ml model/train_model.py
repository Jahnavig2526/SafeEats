import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("safeeats_dataset.csv")

# Convert allergens to list
df['allergens'] = df['allergens'].apply(lambda x: x.split(',') if isinstance(x, str) and x != "" else [])

# Feature extraction
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['ingredients'])

# Convert labels
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(df['allergens'])

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))
pickle.dump(mlb, open("mlb.pkl", "wb"))

print("Model trained and saved!")