import os
import re
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# ফাইল পাথ সেটিংস
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

# --- হেল্পার ফাংশনসমূহ ---
def clean_value(val):
    if val is None or str(val).lower() == "nan" or val == "":
        return "N/A"
    s = str(val).strip()
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_number(val):
    """টেক্সট থেকে শুধু নাম্বার বের করার ফাংশন (যেমন: £2,200,000 -> 2200000)"""
    if pd.isna(val) or val == "N/A":
        return 0
    nums = re.findall(r'\d+', str(val).replace(',', ''))
    return float(nums[0]) if nums else 0

def extract_images(raw_data):
    default_img = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
    if not raw_data or str(raw_data).lower() == "nan":
        return [default_img]
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', str(raw_data))
    return links if links else [default_img]

# --- ১. রুট এন্ডপয়েন্ট ---
@app.route('/')
def home():
    return "<h1>Backend is Running!</h1><p>Routes: /api/properties, /api/risk-data-csv</p>"

# --- ২. প্রোপার্টি ডাটা এন্ডপয়েন্ট ---
@app.route('/api/properties')
def get_properties():
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv not found"}), 404

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
                "images": extract_images(row.get('property_images', '')),
                "yield": clean_value(row.get('service_charge', '5.0')), # Service charge দেখাচ্ছি যেহেতু yield নেই
                "description": clean_value(row.get('description', 'No description available.'))
            })
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ৩. রিস্ক ডাটা এন্ডপয়েন্ট (FIXED) ---
@app.route('/api/risk-data-csv')
def get_risk_data():
    try:
        if not os.path.exists(csv_path):
            return Response("month,risk\nNo File,0", mimetype='text/csv')

        df = pd.read_csv(csv_path)
        
        # আপনার CSV-তে 'expected_yield' নেই, তাই আমরা 'price' অথবা 'service_charge' ব্যবহার করছি
        # এখানে 'property_title' এবং 'price' কলাম নেয়া হচ্ছে
        risk_df = df[['property_title', 'price']].head(15).copy()
        risk_df.columns = ['month', 'risk']
        
        # 'price' কলাম থেকে কারেন্সি সিম্বল সরিয়ে শুধু নাম্বার নেয়া হচ্ছে (যেমন: £2.2M -> 2.2)
        # গ্রাফের সুবিধার জন্য আমরা ভ্যালুটাকে ছোট করে নেব (Price / 100,000)
        risk_df['risk'] = risk_df['risk'].apply(lambda x: extract_number(x) / 100000)
        
        csv_output = risk_df.to_csv(index=False)
        return Response(csv_output, mimetype='text/csv')
    except Exception as e:
        return Response(f"month,risk\nError,{str(e)}", mimetype='text/csv')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)