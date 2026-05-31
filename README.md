# AI-Powered Weather & Soil Intelligence System for Smart Crop Recommendation and Precision Farming

A next-generation agriculture technology platform that integrates distributed wireless hardware feeds, localized climate indicators, predictive soil diagnostics, and foliar computer-vision diagnostics to maximize crop yields.

---

## 🎨 Platform Visual Showcase

### 🌾 1. High-Tech Autonomous Smart Farm Overview
![AgroIntel High-Tech Agriculture Landscape](file:///C:/Users/vatti/.gemini/antigravity-ide/brain/af298604-bab8-495b-bc63-6977f57b4c73/smart_farm_hero_1779697638387.png)

### 🧪 2. Distributed NPK IoT Soil Telemetry Probes
![NPK IoT Soil Probe Calibration](file:///C:/Users/vatti/.gemini/antigravity-ide/brain/af298604-bab8-495b-bc63-6977f57b4c73/soil_probe_telemetry_1779697683359.png)

### 🔍 3. Deep Learning Computer-Vision Leaf Blight Diagnostics
![AI Computer-Vision Leaf Disease Diagnosis](file:///C:/Users/vatti/.gemini/antigravity-ide/brain/af298604-bab8-495b-bc63-6977f57b4c73/crop_disease_scan_1779697711177.png)

### 📹 4. Precision Agriculture & IoT Hardware Video Showcase
*Explore the real-world impact of distributed wireless soil sensors, satellite weather tracking, and smart automated irrigation pumps in modern farming.*

[![Precision Farming and Smart Irrigation Showcase](https://img.youtube.com/vi/a38_2x3XbQA/0.jpg)](https://www.youtube.com/watch?v=a38_2x3XbQA)

---

## 📂 Project Architecture

```text
c:/Users/vatti/OneDrive/Desktop/CROP-RECOMENDATION-TOOL/
├── backend/                  # Node.js + Express Backend Server
│   ├── APIs/                 # Combines routes and controllers
│   │   ├── auth.js           # JWT Authentication & Role Middlewares
│   │   ├── soil.js           # Soil analysis logging & calculations
│   │   ├── weather.js        # Weather feeds & cyclical simulations
│   │   ├── recommendation.js # Crop suggestion & Fertilizer engines
│   │   ├── sensor.js         # IoT upload endpoint and device registries
│   │   └── disease.js        # Multer image uploading & AI classification
│   ├── Models/               # Mongoose DB Models
│   │   ├── UserModel.js
│   │   ├── SoilModel.js
│   │   ├── WeatherModel.js
│   │   ├── CropRecommendationModel.js
│   │   ├── SensorModel.js
│   │   └── DiseaseDetectionModel.js
│   ├── .env                  # Backend Configurations
│   ├── .env.example          # Environment Template
│   ├── .gitignore            # Git Ignored files
│   ├── package.json          # Node dependency definitions
│   ├── req.http              # HTTP API Testing Client Script
│   └── server.js             # Server Entry point (Helmet, CORS, Rate Limit)
├── Frontend/                 # Vite + React Client
│   ├── public/               # Static public assets
│   ├── src/                  # React Source Files
│   │   ├── components/       # Core UI reusable panels
│   │   ├── context/          # State, Dark Mode, i18n & Voice context
│   │   ├── services/         # Axios API connection
│   │   ├── pages/            # Page layouts & dashboards
│   │   │   ├── Landing.jsx   # Gorgeous Landing page & Soil Slider Widget
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SoilAnalystDashboard.jsx
│   │   │   ├── WeatherAnalystDashboard.jsx
│   │   │   ├── ExpertDashboard.jsx
│   │   │   ├── SoilAnalysis.jsx
│   │   │   ├── WeatherDashboard.jsx
│   │   │   ├── CropRecommendation.jsx
│   │   │   ├── SensorMonitoring.jsx
│   │   │   ├── DiseaseDetection.jsx
│   │   │   ├── SmartIrrigation.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── App.jsx           # Main router & Shield wrappers
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Foundational CSS & glassmorphic blurs
│   ├── .env                  # Client Environment Variables
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── ml-model/                 # Standalone ML training scripts
│   ├── crop_prediction.py    # Sklearn Random Forest trainer
│   └── disease_detection.py  # Computer vision leaf classifier
└── iot/                      # Hardware code
    └── esp32-code/
        └── esp32-code.ino    # WiFi & NPK telemetry transmitter sketch
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Active Atlas Cloud connection or local MongoDB server

### 2. Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install verified secure dependencies:
   ```bash
   npm install
   ```
3. Configure environment parameters. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Set MONGODB_URI to your database string. Start the server:
   ```bash
   npm run dev
   ```
   *The server mounts strictly on `http://127.0.0.1:5000` for development security.*
   *Production server is hosted on Render at `https://wheather-and-soil-based-crop.onrender.com`.*

### 3. Frontend Installation
1. Navigate to the capitalized Frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Boot Vite live reload server:
   ```bash
   npm run dev
   ```
   *The client runs locally at `http://127.0.0.1:5173`.*

---

## 🛡️ Secure Coding Protections Enforced

We adhere to rigorous **Secure Web Development Guidelines**:
1. **Token Protection (BFF/XSS prevention)**: Authentication tokens are stored inside `__Secure-Token` cookies set as `HttpOnly`, `Secure`, and `SameSite=Lax`. This blocks scripts from harvesting credentials during XSS triggers.
2. **Strict CORS Policy**: Avoids wildcard (`*`) access models. CORS is locked strictly to allowed localhost development origins and official production/preview domains (`https://wheather-and-soil-based-crop-recomendation-mjrgtsi6l.vercel.app` and matching project subdomains) with credentials allowed, blocking malicious requests.
3. **Helmet Header Protection**: Activates Helmet headers to stop Content-Type Sniffing (`nosniff`), clickjacking (`X-Frame-Options`), and block unsafe inline script executions.
4. **Multer Upload Shield**: Files are filtered based on allowed types (`png`, `jpg`, `jpeg`). Filenames are randomized cryptographically, limited to `5MB`, and stored in a non-executable `./uploads/` directory.
5. **Path Traversal Guards**: The download endpoint sanitizes incoming paths using `path.basename()` and applies strict prefix boundary verification checks to prevent directory escapes.
6. **Robust Parameter Validation**: Mongoose prepared models are used strictly, ensuring all variables are parsed as typed values (floats/ints), blocking SQL or NoSQL injections.
7. **Rate Limiting**: Limits requests per IP to `100 per 15 minutes` to protect server bandwidth.

---

## 🧪 REST API Verification Guide

We have created an interactive testing client script in `backend/req.http`. 
Install the **REST Client** extension in VS Code to test:
1. **User Sign Up**: Select and execute `Register User` POST request.
2. **User Authentication**: Execute `Login User` POST request. The HttpOnly cookie will be bound.
3. **Soil Telemetry**: Execute `Add Soil` POST to check dynamic low/optimal fertility classifications.
4. **AI recommendation**: Execute `Generate Crop Recommendation` to check Random Forest rules.
5. **IoT Upload**: Execute `IoT Sensor Telemetry Upload` to test simulated ESP32 requests.

---

## 📡 ESP32 & IoT Architecture

The `iot/esp32-code/esp32-code.ino` sketch manages wireless nodes:
- Collects raw inputs from moisture probes, pH sensors, and RS485 NPK probes.
- Performs map boundaries calibration.
- Packs values inside a secure JSON string.
- Transmits parameters via HTTP POST requests to `/api/sensor/upload` every 15 minutes.

---

## 🧠 Standalone ML Script Execution

Under `ml-model/` folder:
- **Crop Classification (`crop_prediction.py`)**: Trains a Random Forest crop classifier. Execute using:
  ```bash
  pip install numpy pandas scikit-learn joblib
  python crop_prediction.py
  ```
  *Trains a classifier, outputs accuracy levels, and exports `crop_rf_model.pkl`.*

- **Leaf Diagnosis (`disease_detection.py`)**: Simulates a visual CNN model. Test by running:
  ```bash
  pip install pillow numpy
  python disease_detection.py <path_to_leaf_image.jpg>
  ```
  *Simulates center crops, normalizations, and identifies blast or blight conditions.*
