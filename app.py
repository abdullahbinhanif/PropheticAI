import os
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re

app = Flask(__name__)
# CORS এনাবেল করা হয়েছে যাতে Vercel/Frontend থেকে ডাটা রিকোয়েস্ট সফল হয়
CORS(app)

# ফাইল পাথ ঠিক করা (লোকাল এবং Render সার্ভার উভয়ের জন্য নিরাপদ)
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

# --- নতুন যুক্ত করা এন্ডপয়েন্ট ক্রন-জবের জন্য ---
@app.route('/api/ping')
def ping():
    """এটি শুধু সার্ভারকে জাগিয়ে রাখার জন্য, cron-job.org এ এই লিঙ্কটি দিন"""
    return "Server is alive!", 200

def clean_value(val):
    """টেক্সট থেকে বাড়তি কোটেশন বা ব্র্যাকেট সরানোর ফাংশন"""
    if val is None or str(val).lower() == "nan" or val == "":
        return "N/A"
    s = str(val).strip()
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_images(raw_data):
    """CSV এর ইমেজ কলাম থেকে শুধু URL গুলোর লিস্ট বের করার ফাংশন"""
    default_img = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
    if not raw_data or str(raw_data).lower() == "nan":
        return [default_img]
    
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', str(raw_data))
    
    return links if links else [default_img]

@app.route('/')
def home():
    return "Backend is Running! Use /api/properties to get data."

@app.route('/api/properties')
def get_properties():
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv not found!"}), 404

        # ডাটা টাইপ এরর এড়াতে এবং মেমোরি বাঁচাতে ডাটা রিড
        df = pd.read_csv(csv_path)
        df = df.replace({np.nan: None}) 
        
        properties = []
        
        for index, row in df.iterrows():
            properties.append({
                "id": clean_value(row.get('uprn', index)),
                "title": clean_value(row.get('property_title', 'Residential Property')),
                "address": clean_value(row.get('address', 'United Kingdom')),
                "price": clean_value(row.get('price', 'POA')),
                "epc": clean_value(row.get('ecp_rating', 'N/A')),
                "bedrooms": clean_value(row.get('bedrooms', 'N/A')),
                "tenure": clean_value(row.get('tenure', 'Freehold')),
                "lat": row.get('latitude') if row.get('latitude') else 51.5074,
                "lng": row.get('longitude') if row.get('longitude') else -0.1278,
                "images": extract_images(row.get('property_images', row.get('images', ''))),
                "yield": clean_value(row.get('expected_yield', '5.0')),
                "description": clean_value(row.get('description', 'No detailed description available.'))
            })
        
        # যদি কোন ডাটা না থাকে
        if not properties:
            return jsonify({"message": "No data available", "data": []}), 200

        return jsonify(properties)

    except Exception as e:
        print(f"Error: {e}") # Render লগে এরর প্রিন্ট হবে
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)