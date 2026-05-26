#!/usr/bin/env python3
"""
AI-Powered Weather and Soil Intelligence System
Machine Learning Crop Prediction Engine

This script demonstrates generating a precision agriculture dataset, 
preprocessing nutrient NPK/weather vectors, training a Random Forest 
classifier, evaluating performance, and serializing model metrics.
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Set pseudo-random seed for absolute reproducibility
np.random.seed(42)

def generate_agro_dataset(size=1200):
    """
    Generate high-fidelity agricultural telemetry dataset representing 6 crop types:
    Rice, Maize, Wheat, Cotton, Coffee, Legumes.
    """
    data = []
    crops = ['Rice', 'Maize', 'Wheat', 'Cotton', 'Coffee', 'Legumes']
    
    for i in range(size):
        crop = np.random.choice(crops)
        
        if crop == 'Rice':
            # High water retention clay soil, heavy rain, acidic-neutral ph
            n = np.random.uniform(80, 120)
            p = np.random.uniform(40, 60)
            k = np.random.uniform(30, 50)
            ph = np.random.uniform(5.5, 6.7)
            temp = np.random.uniform(20, 30)
            hum = np.random.uniform(75, 90)
            rain = np.random.uniform(150, 300)
            
        elif crop == 'Maize':
            # Loamy soil, moderate atmospheric conditions
            n = np.random.uniform(70, 100)
            p = np.random.uniform(35, 55)
            k = np.random.uniform(35, 60)
            ph = np.random.uniform(5.8, 7.2)
            temp = np.random.uniform(18, 28)
            hum = np.random.uniform(55, 75)
            rain = np.random.uniform(60, 150)
            
        elif crop == 'Wheat':
            # Clay-loam, cooler dry climates
            n = np.random.uniform(60, 90)
            p = np.random.uniform(30, 50)
            k = np.random.uniform(30, 45)
            ph = np.random.uniform(6.0, 7.5)
            temp = np.random.uniform(10, 22)
            hum = np.random.uniform(50, 65)
            rain = np.random.uniform(30, 80)
            
        elif crop == 'Cotton':
            # Black soil, warm temperatures
            n = np.random.uniform(50, 80)
            p = np.random.uniform(25, 45)
            k = np.random.uniform(60, 95)
            ph = np.random.uniform(5.8, 7.8)
            temp = np.random.uniform(22, 32)
            hum = np.random.uniform(60, 80)
            rain = np.random.uniform(50, 120)
            
        elif crop == 'Coffee':
            # Acidic red soil, hilly high altitudes
            n = np.random.uniform(90, 130)
            p = np.random.uniform(20, 40)
            k = np.random.uniform(110, 160)
            ph = np.random.uniform(4.8, 6.0)
            temp = np.random.uniform(15, 25)
            hum = np.random.uniform(70, 85)
            rain = np.random.uniform(180, 350)
            
        else: # Legumes
            # Light soil, low nitrogen needs, high phosphorus
            n = np.random.uniform(20, 45)
            p = np.random.uniform(50, 70)
            k = np.random.uniform(40, 60)
            ph = np.random.uniform(6.0, 7.0)
            temp = np.random.uniform(16, 26)
            hum = np.random.uniform(45, 65)
            rain = np.random.uniform(40, 90)
            
        data.append([n, p, k, ph, temp, hum, rain, crop])

    cols = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'temperature', 'humidity', 'rainfall', 'crop']
    return pd.DataFrame(data, columns=cols)

def main():
    print("--------------------------------------------------")
    print("     AGRO-INTELLIGENCE: ML MODEL TRAINING         ")
    print("--------------------------------------------------")

    # 1. Acquire precision datasets
    print("[1/4] Synthesizing agricultural soil & weather profiles...")
    df = generate_agro_dataset(size=1500)
    print(f"      Generated dataset size: {df.shape[0]} profiles.")

    # 2. Segment labels and partition arrays
    X = df.drop(columns=['crop'])
    y = df['crop']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Train Random Forest Classifier
    print("[2/4] Initializing and training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    print("      Model training complete.")

    # 4. Run classification metrics
    print("[3/4] Evaluating trained classifier...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"      Validation Accuracy: {accuracy * 100:.2f}%")
    print("\n--- Detailed Classification Performance ---")
    print(classification_report(y_test, y_pred))

    # 5. Serialize model metrics
    print("[4/4] Serializing model parameters...")
    model_dir = './models'
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, 'crop_rf_model.pkl')
    joblib.dump(model, model_path)
    print(f"      Model binary successfully written to: {model_path}")
    print("--------------------------------------------------")

if __name__ == '__main__':
    main()
