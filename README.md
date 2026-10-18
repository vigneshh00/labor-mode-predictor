# 🩺 MaternaAI — Delivery Mode & Cesarean Risk Assessment System

An intelligent clinical decision support platform powered by Machine Learning and Deep Learning, designed to evaluate maternal, obstetric, and fetal indicators to classify delivery mode (**Normal Spontaneous Vaginal Delivery** vs. **Cesarean Section**) and assess surgical risk.

The platform provides an interactive React-based clinical dashboard connected to a Flask REST API, offering real-time single-patient diagnostics, batch CSV record evaluation, and comparative performance visualizations across multiple trained classification algorithms.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Machine Learning Models & Performance](#-machine-learning-models--performance)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Backend Setup (Flask API)](#1-backend-setup-flask-api)
  - [2. Frontend Setup (React Client)](#2-frontend-setup-react-client)
- [API Endpoints](#-api-endpoints)
- [Dataset & Clinical Features](#-dataset--clinical-features)
- [Tech Stack](#-tech-stack)

---

## 🔍 Overview

Cesarean delivery can be a life-saving surgical procedure when vaginal birth poses risks to the mother or child. However, timely decision-making is critical in obstetric care. 

This project analyzes clinical, maternal demographic, and fetal monitoring data to classify delivery type (**Normal** vs. **C-Section**). It implements multiple trained machine learning models with preprocessing pipelines including label encoding, standard scaling, and class balancing via SMOTE.

---

## 🏗️ System Architecture

```
[ User Browser ]
       │
       ▼
[ React 18 UI (Port 3000) ]
   ├── Home & Overview
   ├── Model Comparison Dashboard
   ├── Interactive Prediction Form (Sampling & CSV Upload)
   └── Visualizations (Chart.js / Confusion Matrices)
       │
       │ HTTP / REST (CORS enabled)
       ▼
[ Flask Backend (Port 5000) ]
   ├── /predict  ──> Real-time diagnostic evaluation based on patient clinical inputs
   └── /predict1 ──> Batch prediction based on uploaded patient CSV records
       │
       ▼
[ Trained ML / DL Pipeline ]
   ├── Scaler & Encoders (StandardScaler, LabelEncoder)
   └── Classification Models:
       ├── Logistic Regression
       ├── Decision Tree
       ├── Random Forest
       ├── K-Nearest Neighbors (KNN)
       ├── Support Vector Machine (SVM)
       └── Artificial Neural Network (Keras / TensorFlow)
```

---

## 📊 Machine Learning Models & Performance

The models were evaluated on clinical test sets using Accuracy, Precision, Recall, and F1-Score:

| Model | Accuracy (%) | Precision (%) | Recall (%) | F1 Score (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **99.39%** | **99.74%** | **99.48%** | **99.61%** |
| **Decision Tree** | 99.29% | 100.00% | 99.10% | 99.55% |
| **Neural Network (MLP)** | 99.19% | 99.36% | 99.61% | 99.49% |
| **K-Nearest Neighbours** | 96.54% | 98.56% | 97.04% | 97.79% |
| **Random Forest** | Evaluated | Evaluated | Evaluated | Evaluated |
| **Support Vector Machine (SVM)** | Evaluated | Evaluated | Evaluated | Evaluated |

---

## ✨ Key Features

- **Interactive Predictions**:
  - **Single / Sample-based Prediction**: Test predefined synthetic or sampled clinical records against any selected algorithm.
  - **Batch / File Upload**: Upload patient CSV files directly via the UI for automated preprocessing and immediate classification.
- **Model Comparison Dashboard**: Interactive comparison of key performance metrics across all models.
- **Visual Analytics**:
  - Interactive confusion matrix displays powered by **Chart.js**.
  - Static visual comparisons including ROC/Precision-Recall curves and model metric benchmarks.
- **Robust Clinical Pipeline**:
  - Categorical transformation via pre-fitted Label Encoders.
  - Standardized feature scaling via pre-fitted Standard Scalers.
  - Support for deep learning (`.keras`) and Scikit-learn (`.pkl`) serialized models.

---

## 📁 Project Structure

```text
C_SECTION_PREDICTOR/
├── Client/                             # React Frontend (Picture-Free Modern UI)
│   ├── public/                         # Public assets, favicon, index.html
│   │   ├── Logo.webp                   # Application favicon
│   │   ├── index.html                  # HTML template
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── Components/
│   │   │   ├── About.js                # Clinical hero & statistics overview
│   │   │   ├── Highlights.js           # Decision support core capability cards
│   │   │   ├── Model.js                # Model metrics grid & progress bars
│   │   │   ├── Navbar.js               # Glassmorphism header with SVG brand
│   │   │   ├── Predict.js              # Diagnostic workbench (Simulation & CSV)
│   │   │   └── Visualize.js            # Chart.js confusion matrices & benchmarks
│   │   ├── App.js                      # Root React component & clinical footer
│   │   ├── App.css                     # Modern clinical SaaS design system
│   │   ├── results.json                # Model performance metrics data (6 models)
│   │   ├── index.js                    # React root entry point
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json                    # Frontend dependencies and scripts (includes axios)
│   └── package-lock.json
│
├── flask-server/                       # Flask API & ML Model Artifacts
│   ├── server.py                       # Flask server and prediction routes
│   ├── c_section.py                    # Training and preprocessing script
│   ├── c_section_multiway.py           # Multi-class experiment pipeline
│   ├── c_section_multiway.ipynb        # Multi-class experiment notebook
│   ├── Dataset.xlsx                    # Original clinical dataset
│   ├── random_c_section_instance.csv   # Sample test CSV (C-Section record)
│   ├── random_normal_instance.csv      # Sample test CSV (Normal record)
│   ├── dt.pkl                          # Decision Tree model
│   ├── KNN.pkl                         # K-Nearest Neighbors model
│   ├── Logreg.pkl                      # Logistic Regression model
│   ├── rf.pkl                          # Random Forest model
│   ├── clf.pkl                         # SVM Classifier model
│   ├── nn_model.keras                  # Keras Neural Network model
│   ├── normal_birth_instances.npy      # Pre-indexed normal birth sample vectors
│   ├── c_section_instances.npy         # Pre-indexed C-section sample vectors
│   ├── label_encoders.pkl              # Pre-fitted Label Encoders
│   └── standard_scaler.pkl             # Pre-fitted StandardScaler
│
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

---

## ⚙️ Prerequisites

Make sure the following dependencies are installed on your machine:

- **Python**: Version `3.9` to `3.11`
- **Node.js**: Version `16.x` or later (with `npm`)
- **Git**

---

## 🚀 Installation & Setup

### 1. Backend Setup (Flask API)

1. Navigate to the `server` directory:
   ```bash
   cd "server"
   ```

2. Activate the Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

3. Start the Flask API:
   ```bash
   python server.py
   ```
   *The API will start running at `http://localhost:5000`.*

---

### 2. Frontend Setup (React Client)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd "client"
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   *The React application will automatically open at `http://localhost:3000`.*

---

## 📡 API Endpoints

### `POST /predict`
Evaluates delivery outcome based on the patient's actual clinical and maternal health inputs.

* **Request Body** (`application/json`):
  ```json
  {
    "age": 28,
    "height_cm": 165,
    "weight_kg": 68,
    "gestational_age_weeks": 39,
    "weight_gain_kg": 12,
    "previous_cesarean": "no",
    "num_previous_cesarean": 0,
    "fetal_presentation": "cephalic",
    "comorbidity": "no",
    "obstetric_risk": "low",
    "induction": "no",
    "model_name": "logistic_regression"
  }
  ```

* **Response** (`200 OK`):
  ```json
  {
    "prediction": 0,
    "birth_type": "Normal Vaginal Delivery",
    "probability": 0.059,
    "risk_level": "Low Risk",
    "risk_score": 0.05,
    "risk_factors": [
      "Normal cephalic term pregnancy with no prior uterine scars"
    ],
    "summary": "Patient parameters and clinical metrics support a favorable trajectory for spontaneous vaginal birth.",
    "model_used": "logistic_regression"
  }
  ```

---

### `POST /predict1`
Processes an uploaded patient records file (`.csv`) with automatic column detection, support for the downloadable template, and NaN imputation.

* **Request Type**: `multipart/form-data`
* **Form Fields**:
  - `file`: Patient CSV file (e.g. using `patient_template.csv`)
  - `model_name`: Algorithm identifier (`logistic_regression`, `decision_tree`, `random_forest`, `neural_network`, `svm`, `knn`)

---

### `GET /download-template`
Downloads a sample CSV template (`patient_template.csv`) pre-filled with example clinical rows for easy evaluation.

---

### `POST /predict1`
Processes an uploaded clinical record in `.csv` format, transforms features via pre-fitted encoders and scalers, and returns the model prediction.

* **Request Type**: `multipart/form-data`
* **Form Fields**:
  - `file`: CSV file containing clinical features (e.g., using `flask-server/random_c_section_instance.csv` or `flask-server/random_normal_instance.csv`)
  - `model_name`: Algorithm identifier (`knn`, `logistic_regression`, `decision_tree`, `random_forest`, `svm`, `neural_network`)

* **Response** (`200 OK`):
  ```json
  {
    "prediction": 1,
    "birth_type": "C-section"
  }
  ```

---

## 📋 Dataset & Clinical Features

The system evaluates various clinical parameters recorded during antenatal care and delivery:

- **Maternal Demographics & Anthropometry**: Age, Height, Weight, BMI, Gestational Age.
- **Obstetric History**: Parity, Previous Cesarean Deliveries, Miscarriages, Previous Term/Preterm Pregnancies.
- **Clinical Comorbidities & Risks**: Obstetric Risk flags, Medical Indications, Cardiotocography findings.
- **Labor & Delivery Factors**: Induction status, Ruptured Membranes duration (ROM), Amniotic Liquid classification, Robson Classification Group.
- **Fetal Metrics**: Fetal intrapartum pH, Fetal Sex, Estimated Birth Weight, Apgar Scores (1 min and 5 min).

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Material-UI (MUI v6)
  - Bootstrap 5 & React-Bootstrap
  - Chart.js & React-Chartjs-2
  - Axios
- **Backend**:
  - Flask & Flask-CORS
- **Machine Learning & Data Science**:
  - Scikit-learn (KNN, Logistic Regression, Decision Tree, Random Forest, SVM)
  - TensorFlow / Keras (Multi-Layer Perceptron / Neural Network)
  - Pandas, NumPy, OpenPyXL
  - Imbalanced-learn (SMOTE)
