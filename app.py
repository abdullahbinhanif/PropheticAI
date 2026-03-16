import os
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re

app = Flask(__name__)
# CORS এনাবেল করা হয়েছে যাতে Vercel থেকে রিকোয়েস্ট আসতে পারে
CORS(app)

# ফাইল পাথ ঠিক করা (Render এর জন্য নিরাপদ)
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

def clean_value(val):
    """টেক্সট থেকে বাড়তি কোটেশন বা ব্র্যাকেট সরানোর ফাংশন"""
    if val is None or str(val).lower() == "nan" or val == "":
        return "N/A"
    s = str(val).strip()
    # শুরুর এবং শেষের কোটেশন বা থার্ড ব্র্যাকেট সরানো
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_images(raw_data):
    """CSV এর ইমেজ কলাম থেকে শুধু URL গুলোর লিস্ট বের করার ফাংশন"""
    if not raw_data or str(raw_data).lower() == "nan":
        return ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"]
    
    # রেগুলার এক্সপ্রেশন দিয়ে সব http লিঙ্ক বের করা
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', str(raw_data))
    
    if not links:
        return ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"]
    return links

@app.route('/')
def home():
    return "Backend is Running! Use /api/properties to get data."

@app.route('/api/properties')
def get_properties():
    try:
        # CSV ফাইল লোড করা
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv not found!"}), 404

        df = pd.read_csv(csv_path)
        # NaN ভ্যালুগুলোকে খালি স্ট্রিং দিয়ে রিপ্লেস করা
        df = df.replace({np.nan: None}) 
        
        properties = []
        
        # ১,০০০ রো প্রসেস করা হচ্ছে
        for index, row in df.iterrows():
            # আপনার CSV কলামের নাম অনুযায়ী ডাটা নেওয়া হচ্ছে
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
        
        return jsonify(properties)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Render এ ডিপ্লয় করার সময় PORT এনভায়রনমেন্ট ভ্যারিয়েবল প্রয়োজন হয়
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)