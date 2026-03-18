import os
import re
import pandas as pd
from flask import Flask, jsonify, Response, request
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes to allow seamless communication with the React frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration for file paths and environment variables
base_path = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_path, 'table.csv')

# --- Data Transformation & Cleaning Helpers ---

def clean_value(val):
    """
    Cleans raw data from CSV:
    - Returns 'N/A' for missing/empty values.
    - Fixes common UTF-8 encoding issues (e.g., currency symbols).
    - Removes surrounding quotes or brackets.
    """
    if pd.isna(val) or str(val).lower() == "nan" or str(val).strip() == "":
        return "N/A"
    
    s = str(val).strip()
    # Correcting UTF-8 encoding artifacts for symbols like £
    s = s.replace('Â£', '£').replace('Â', '')
    # Removing extra formatting characters like quotes or brackets
    s = re.sub(r'^["\'\[]+|["\'\]]+$', '', s)
    return s

def extract_number(val):
    """
    Extracts numeric values from string data (Price or Yield):
    - Removes currency symbols, commas, and non-numeric characters.
    - Returns 0 if no numeric data is found or if value is N/A.
    """
    if pd.isna(val) or str(val).strip() == "" or str(val).lower() == "n/a":
        return 0
    clean_str = re.sub(r'[^\d.]', '', str(val).replace(',', ''))
    try:
        return float(clean_str) if clean_str else 0
    except ValueError:
        return 0

def extract_images(raw_data):
    """
    Extracts all valid HTTP/HTTPS URLs from a string containing image links.
    Returns an array of URL strings.
    """
    if pd.isna(raw_data) or str(raw_data).strip() == "":
        return []
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-f_A-F][0-9a-f_A-F]))+', str(raw_data))
    return links

# --- API Endpoints ---

@app.route('/')
def home():
    """
    System Health Check:
    Verifies database connectivity and checks environment variables like Backend_URL and Google Client ID.
    """
    return jsonify({
        "status": "Audit Intelligence Active",
        "database_connected": os.path.exists(csv_path),
        "backend_url": os.environ.get('Backend_URL', 'Default: 5000'),
        "google_client_id": os.environ.get('GOOGLE_CLIENT_ID', 'Not Set')
    })

@app.route('/api/properties', methods=['GET'])
def get_properties():
    """
    Retrieves the full list of properties:
    Parses the CSV and maps raw columns to structured JSON objects for the frontend Explorer.
    """
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "table.csv database file not found"}), 404

        df = pd.read_csv(csv_path)
        properties = []
        
        for index, row in df.iterrows():
            uprn_val = clean_value(row.get('uprn'))
            # Fallback ID generation to ensure unique identification for frontend routing
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
    """
    Retrieves detailed data for a specific asset:
    Filters the dataset based on the unique UPRN provided via the URL parameter.
    """
    try:
        if not os.path.exists(csv_path):
            return jsonify({"error": "CSV database missing"}), 404
            
        df = pd.read_csv(csv_path)
        # Filtering dataframe based on UPRN match
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
    """
    Dynamic CSV Stream for Risk Analysis:
    Filters relevant columns and converts them into a flat CSV format for analytics tools.
    """
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

# --- Main Entry Point ---

if __name__ == '__main__':
    # Supports both local development and containerized deployment via environment ports
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)