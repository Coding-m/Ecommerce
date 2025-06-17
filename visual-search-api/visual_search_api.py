from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from torchvision import models, transforms
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = models.resnet50(pretrained=True)
model = torch.nn.Sequential(*(list(model.children())[:-1]))
model.eval()

# Load embeddings
product_embeddings = np.load("product_embeddings.npy", allow_pickle=True).item()
image_names = list(product_embeddings.keys())
image_vectors = np.array(list(product_embeddings.values()))

# Preprocess uploaded image
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def extract_vector(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        vector = model(tensor).squeeze().numpy().flatten()
    return vector

@app.post("/visual-search/")
async def visual_search(image: UploadFile = File(...)):
    image_bytes = await image.read()
    query_vec = extract_vector(image_bytes).reshape(1, -1)
    similarities = cosine_similarity(query_vec, image_vectors)[0]
    top_indices = similarities.argsort()[-5:][::-1]
    results = [
        {"image_name": image_names[i], "score": float(similarities[i])}
        for i in top_indices
    ]
    return {"results": results}
