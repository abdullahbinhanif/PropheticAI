import os
import re
import pandas as pd
from flask import Flask, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
# আপনার saved variable GOOGLE_CLIENT_ID বা অন্য সিকিউরিটি কনফিগারেশন থাকলে এখানে যোগ করতে পারেন
CORS(app, resources={r"/api/*": {"origins": "*"}})

# File path settings
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

# --- Helper Functions ---

def clean_value(val):
    """ক্লিনিং ফাংশন: NaN বা খালি ঘর থাকলে N/A রিটার্ন করবে"""
    if pd.isna(val) or str(val).lower() == "nan" or str(val).strip() == "":
        return "N/A"
    s = str(val).strip()
    # কারেন্সি এবং এনকোডিং ফিক্স
    s = s.replace('Â£', '£').replace('Â', '')
    # এক্সট্রা কোট বা ব্র্যাকেট রিমুভ
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_number(val):
    """নাম্বার এক্সট্র্যাক্টর: গ্রাফের জন্য প্রাইস বা ইল্ড নাম্বার বের করবে"""
    if pd.isna(val) or str(val).strip() == "" or str(val).lower() == "n/a":
        return 0
    # শুধুমাত্র ডিজিট এবং ডট রাখবে (কমা বা পাউন্ড সাইন ফেলে দিবে)
    clean_str = re.sub(r'[^\d.]', '', str(val).replace(',', ''))
    try:
        return float(clean_str) if clean_str else 0
    except ValueError:
        return 0

def extract_images(raw_data):
    """ইমেজ ইউআরএল এক্সট্র্যাক্টর"""
    if pd.isna(raw_data) or str(raw_data).strip() == "":
        return []
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-f_A-F][0-9a-f_A-F]))+', str(raw_data))
    return links

# --- Endpoints ---

@app.route('/')
def home():
    return jsonify({
        "status": "Audit Intelligence Active",
        "database_connected": os.path.exists(csv_path),
        "backend_url": os.environ.get('Backend_URL', 'Default: 5000') # আপনার এনভায়রনমেন্ট ভেরিয়েবল
    })

@app.route('/api/properties')
def get_properties():
    """আপনার দেওয়া CSV কলাম নেম অনুযায়ী ম্যাপ করা হয়েছে"""
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv not found"}), 404

        # CSV রিড করা (Low memory handling)
        df = pd.read_csv(csv_path)
        properties = []
        
        for index, row in df.iterrows():
            properties.append({
                # Identification
                "uprn": clean_value(row.get('uprn')),
                "property_title": clean_value(row.get('property_title')),
                "property_type": clean_value(row.get('property_type')),
                "address": clean_value(row.get('address')),
                
                # Financials (মূল কি-পয়েন্টস)
                "price": clean_value(row.get('price')),
                "price_num": extract_number(row.get('price')), 
                "deposit": clean_value(row.get('deposit')),
                "price_per_size": clean_value(row.get('price_per_size')),
                "service_charge": clean_value(row.get('service_charge')),
                
                # Market Analysis (গ্রাফের ইল্ড ডাটার জন্য এটি ব্যবহার হবে)
                "yield": clean_value(row.get('market_stats_renta_opportunities')),
                "yield_num": extract_number(row.get('market_stats_renta_opportunities')),
                "history": clean_value(row.get('listing_history')),
                
                # Specifications
                "bedrooms": clean_value(row.get('bedrooms')),
                "bathrooms": clean_value(row.get('bathrooms')),
                "receptions": clean_value(row.get('receptions')),
                "property_size": clean_value(row.get('property_size')),
                
                # Rating & Status
                "ecp_rating": clean_value(row.get('ecp_rating')),
                "council_tax_band": clean_value(row.get('council_tax_band')),
                "tenure": clean_value(row.get('tenure')),
                "availability": clean_value(row.get('availability')),
                
                # Links & Media
                "property_images": extract_images(row.get('property_images')),
                "google_map": clean_value(row.get('google_map_location')),
                "virtual_tour": clean_value(row.get('virtual_tour'))
            })
            
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-data-csv')
def get_risk_data():
    """টাইমলাইন গ্রাফের জন্য স্পেসিফিক ডাটা স্ট্রিম"""
    try:
        if not os.path.exists(csv_path):
            return Response("title,price,yield\nNo Data,0,0", mimetype='text/csv')

        df = pd.read_csv(csv_path)
        risk_list = []
        for index, row in df.iterrows():
            risk_list.append({
                "title": clean_value(row.get('property_title')),
                "price": extract_number(row.get('price')),
                "yield": extract_number(row.get('market_stats_renta_opportunities'))
            })
            
        risk_df = pd.DataFrame(risk_list)
        return Response(risk_df.to_csv(index=False), mimetype='text/csv')
    except Exception as e:
        return Response(f"error\n{str(e)}", mimetype='text/csv')

if __name__ == '__main__':
    # আপনার Backend_URL এর সাথে মিল রেখে পোর্ট সেটআপ
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)