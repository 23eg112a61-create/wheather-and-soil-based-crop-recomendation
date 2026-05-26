/**
 * AI-Powered Weather and Soil Intelligence System
 * ESP32 Telemetry Transmitter Node
 * 
 * This sketch demonstrates connecting to local Wi-Fi, scanning raw analog NPK, 
 * pH, and soil moisture sensor pins, formatting parameters inside a JSON payload, 
 * and sending an HTTP POST transmission to the Node.js API server.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Make sure to install ArduinoJson library in Arduino IDE

// Wi-Fi Access Credentials
const char* ssid = "YOUR_FARM_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Target Server Configuration
// Replace with your hosted Render URL or local network IP
const char* serverEndpoint = "http://192.168.1.100:5000/api/sensor/upload";

// Hardware Analog Sensor Pins Mapping
const int soilMoisturePin = 32;
const int phSensorPin = 34;
const int npkAnalogPin = 35; // NPK RS485 module representation

// Device Identity Definitions
const char* deviceId = "NODE-01-NPK";
const char* sensorType = "IoT Multi-Sensor Field Node";

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("Initializing distributed IoT wireless node...");
  
  // Wi-Fi Connection boot
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi networks");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! Assigned wireless IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n--- Initiating Telemetry Scanning Cycle ---");

    // 1. Read Raw mechanical values from Pin arrays
    int rawMoisture = analogRead(soilMoisturePin);
    int rawPh = analogRead(phSensorPin);
    int rawNpk = analogRead(npkAnalogPin);

    // 2. Calibrate sensor models to real-world metric mappings
    float moisturePercent = map(rawMoisture, 4095, 1200, 0, 100); // Enforce 0-100% bounds
    moisturePercent = constrain(moisturePercent, 0.0, 100.0);

    float phValue = map(rawPh, 0, 4095, 0, 14); // pH bounds 0-14
    phValue = constrain(phValue, 0.0, 14.0);

    // Simulate NPK, Temperature, and EC sensor mappings
    float nitrogen = map(rawNpk, 0, 4095, 20, 150);
    float phosphorus = map(rawNpk, 0, 4095, 10, 80);
    float potassium = map(rawNpk, 0, 4095, 15, 100);
    float temperature = 24.5 + (random(-10, 10) * 0.1);
    float ecValue = 1.2 + (random(-2, 2) * 0.1);
    int batteryLevel = 88; // Read from internal battery dividers

    // 3. Format telemetry payload inside a JSON Document
    StaticJsonDocument<500> jsonDoc;
    jsonDoc["deviceId"] = deviceId;
    jsonDoc["sensorType"] = sensorType;
    jsonDoc["batteryLevel"] = batteryLevel;
    jsonDoc["status"] = "online";

    // Soil sub-document mapping
    JsonObject soilData = jsonDoc.createNestedObject("soilData");
    soilData["moisture"] = moisturePercent;
    soilData["ph"] = phValue;
    soilData["nitrogen"] = nitrogen;
    soilData["phosphorus"] = phosphorus;
    soilData["potassium"] = potassium;
    soilData["temperature"] = temperature;
    soilData["ecValue"] = ecValue;

    String jsonString;
    serializeJson(jsonDoc, jsonString);
    Serial.println("Payload ready: " + jsonString);

    // 4. Transmit Payload via HTTP client methods
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Transmission Successful! Response Code: ");
      Serial.println(httpResponseCode);
      Serial.println("Server confirmation payload: " + response);
    } else {
      Serial.print("Transmission Failure. Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end(); // Clear connection resources
  } else {
    Serial.println("Wi-Fi network connection lost. Postponing scan.");
  }

  // Set transmission interval: Send telemetry reads every 15 minutes
  delay(15 * 60 * 1000); 
}
