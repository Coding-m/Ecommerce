import os
import numpy as np
from PIL import Image
import torch
from torchvision import models, transforms

# Load pretrained model
model = models.resnet50(pretrained=True)
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # remove final layer
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def extract_vector(image_path):
    img = Image.open(image_path).convert("RGB")
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        vector = model(tensor).squeeze().numpy().flatten()
    return vector

folder = "product_images/"
embeddings = {}

for file in os.listdir(folder):
    if file.lower().endswith(('.jpg', '.png')):
        path = os.path.join(folder, file)
        vec = extract_vector(path)
        embeddings[file] = vec

np.save("product_embeddings.npy", embeddings)
print("✅ Embeddings saved to product_embeddings.npy")
