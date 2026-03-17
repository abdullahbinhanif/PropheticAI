import os
import re
import pandas as pd
from flask import Flask, jsonify, Response, request
from flask_cors import CORS

app = Flask(__name__)

# CORS সেটিংস: সব অরিজিন এলাউ করা হয়েছে যাতে রিঅ্যাক্ট থেকে কানেক্ট করতে সমস্যা না হয়
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ফাইল পাথ সেটিংস
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

# --- Helper Functions ---

def clean_value(val):
    """NaN বা খালি ঘর থাকলে N/A রিটার্ন করবে এবং এনকোডিং ঠিক করবে"""
    if pd.isna(val) or str(val).lower() == "nan" or str(val).strip() == "":
        return "N/A"
    s = str(val).strip()
    # কারেন্সি এবং এনকোডিং ফিক্স (UTF-8)
    s = s.replace('Â£', '£').replace('Â', '')
    # এক্সট্রা কোট বা ব্র্যাকেট রিমুভ
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_number(val):
    """প্রাইস বা ইল্ড কলাম থেকে শুধুমাত্র নাম্বার বের করবে"""
    if pd.isna(val) or str(val).strip() == "" or str(val).lower() == "n/a":
        return 0
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
    """এপিআই স্ট্যাটাস চেক"""
    return jsonify({
        "status": "Audit Intelligence Active",
        "database_connected": os.path.exists(csv_path),
        "backend_url": os.environ.get('Backend_URL', 'Default: 5000'),
        "google_client_id": os.environ.get('GOOGLE_CLIENT_ID', 'Not Set')
    })

@app.route('/api/properties', methods=['GET'])
def get_properties():
    """সব প্রপার্টির ডিটেইলস ডাটা"""
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv not found"}), 404

        df = pd.read_csv(csv_path)
        properties = []
        
        for index, row in df.iterrows():
            uprn_val = clean_value(row.get('uprn'))
            # ফ্রন্টএন্ডে নেভিগেশনের জন্য 'id' ফিল্ড মাস্ট লাগবে
            p_id = uprn_val if uprn_val != "N/A" else f"prop-{index}"
            
            properties.append({
                "id": p_id, 
                "uprn": uprn_val,
                "property_title": clean_value(row.get('property_title')),
                "property_type": clean_value(row.get('property_type')),
                "address": clean_value(row.get('address')),
                "price": clean_value(row.get('price')),
                "price_num": extract_number(row.get('price')), 
                "deposit": clean_value(row.get('deposit')),
                "price_per_size": clean_value(row.get('price_per_size')),
                "service_charge": clean_value(row.get('service_charge')),
                "yield": clean_value(row.get('market_stats_renta_opportunities')),
                "yield_num": extract_number(row.get('market_stats_renta_opportunities')),
                "history": clean_value(row.get('listing_history')),
                "bedrooms": clean_value(row.get('bedrooms')),
                "bathrooms": clean_value(row.get('bathrooms')),
                "receptions": clean_value(row.get('receptions')),
                "property_size": clean_value(row.get('property_size')),
                "ecp_rating": clean_value(row.get('ecp_rating')),
                "council_tax_band": clean_value(row.get('council_tax_band')),
                "tenure": clean_value(row.get('tenure')),
                "availability": clean_value(row.get('availability')),
                "property_images": extract_images(row.get('property_images')),
                "google_map": clean_value(row.get('google_map_location')),
                "virtual_tour": clean_value(row.get('virtual_tour'))
            })
            
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties/<prop_id>', methods=['GET'])
def get_single_property(prop_id):
    """নির্দিষ্ট একটি প্রপার্টির ডাটা (PropertyDetail পেজের জন্য)"""
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "CSV database missing"}), 404
            
        df = pd.read_csv(csv_path)
        # uprn কলামে আইডিটি খোঁজা হচ্ছে
        match = df[df['uprn'].astype(str) == str(prop_id)]
        
        if match.empty:
            return jsonify({"error": "Property not found"}), 404
            
        row = match.iloc[0]
        return jsonify({
            "id": prop_id,
            "uprn": prop_id,
            "property_title": clean_value(row.get('property_title')),
            "address": clean_value(row.get('address')),
            "price": clean_value(row.get('price')),
            "price_num": extract_number(row.get('price')),
            "property_images": extract_images(row.get('property_images')),
            "ecp_rating": clean_value(row.get('ecp_rating')),
            "tenure": clean_value(row.get('tenure')),
            "bedrooms": clean_value(row.get('bedrooms')),
            "bathrooms": clean_value(row.get('bathrooms')),
            "property_size": clean_value(row.get('property_size')),
            "yield": clean_value(row.get('market_stats_renta_opportunities')),
            "google_map": clean_value(row.get('google_map_location'))
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-data-csv')
def get_risk_data():
    """রিস্ক পেজের জন্য CSV ডাটা স্ট্রিম"""
    try:
        if not os.path.exists(csv_path):
            return Response("uprn,title,price,ecp_rating,tenure\n", mimetype='text/csv')

        df = pd.read_csv(csv_path)
        risk_list = []
        for index, row in df.iterrows():
            risk_list.append({
                "uprn": clean_value(row.get('uprn')),
                "title": clean_value(row.get('property_title')),
                "price": extract_number(row.get('price')),
                "ecp_rating": clean_value(row.get('ecp_rating')),
                "tenure": clean_value(row.get('tenure'))
            })
            
        risk_df = pd.DataFrame(risk_list)
        return Response(risk_df.to_csv(index=False), mimetype='text/csv')
    except Exception as e:
        return Response(f"error\n{str(e)}", mimetype='text/csv')

if __name__ == '__main__':
    # এনভায়রনমেন্ট ভেরিয়েবল সাপোর্ট
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)