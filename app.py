from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import json
import numpy as np

# ১. প্রথমে 'app' ডিফাইন করতে হবে (এটি আপনার এরর ফিক্স করবে)
app = Flask(__name__)
CORS(app) 

@app.route('/api/properties')
def get_properties():
    try:
        # ২. CSV ফাইল রিড করা
        df = pd.read_csv('dataset.csv')
        
        # ৩. NaN ভ্যালু ক্লিন করা (React এরর এড়াতে)
        df = df.replace({np.nan: None})
        df = df.fillna("")
        
        properties = []
        
        # প্রথম ১০০টি ডেটা প্রসেস করা
        for index, row in df.head(100).iterrows():
            
            # মার্কেট স্ট্যাটাস পার্স করা
            market_val = "0%" 
            raw_stats = row.get('market_stats_last_12_months', '')
            
            if raw_stats and isinstance(raw_stats, str):
                try:
                    cleaned_json = raw_stats.replace("''", '"').replace("'", '"')
                    stats = json.loads(cleaned_json)
                    market_val = stats.get('average_estimated', '').split('(')[-1].replace(')', '')
                except:
                    market_val = "0%"

            # ডেটা অবজেক্ট তৈরি
            properties.append({
                "id": str(row.get('uprn', index)),
                "title": str(row.get('property_title', 'Property for Sale')),
                "address": str(row.get('address', 'Address not listed')),
                "price": str(row.get('price', 'POA')),
                "epc": str(row.get('ecp_rating', 'N/A')),
                "tenure": str(row.get('tenure', 'Leasehold')),
                "market_stats": market_val,
                "logic": f"Investment stability analysis based on {row.get('ecp_rating', 'N/A')} rating."
            })
        
        return jsonify(properties)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# ৪. মেইন এন্ট্রি পয়েন্ট
if __name__ == '__main__':
    app.run(debug=True, port=5000)