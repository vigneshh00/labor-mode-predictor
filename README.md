# 🩺 MaternaAI — Delivery Mode & Cesarean Risk Assessment System

An intelligent clinical decision support platform powered by Machine Learning and Deep Learning, designed to evaluate maternal, obstetric, and fetal indicators to classify delivery mode (**Normal Spontaneous Vaginal Delivery** vs. **Cesarean Section**) and stratify surgical risk.

The platform provides a modern, picture-free clinical dashboard built with React 18 and Material-UI connected to a Flask REST API, offering real-time patient diagnostics, batch CSV record evaluation, and comparative performance visualizations across multiple trained classification algorithms.

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

Cesarean delivery is a life-saving surgical procedure when vaginal birth poses risks to the mother or fetus. However, timely and informed decision-making is critical in obstetric triage to avoid unnecessary emergency procedures and minimize maternal-fetal morbidity.

**MaternaAI** analyzes clinical, maternal demographic, labor progression, and fetal monitoring parameters to classify the delivery mode. The backend implements six trained machine learning and deep learning models with automated preprocessing pipelines including categorical label encoding, feature scaling, and class balancing via SMOTE.

---

## 🏗️ System Architecture

```text
[ Clinician / User Browser ]
             │
             ▼
[ React 18 Dashboard (Port 3000) ]
   ├── Clinical Overview & Mission Hero
   ├── Model Benchmark & Metric Dashboard
   ├── Patient Inference Workbench:
   │   ├── Interactive Patient Health Form (Live BMI & Risk Stratification)
   │   └── CSV Record Batch Upload (with Downloadable Template)
   └── Visual Analytics (Chart.js Interactive Confusion Matrices)
             │
             │ HTTP / REST (CORS enabled)
             ▼
[ Flask REST API (Port 5000) ]
   ├── POST /predict            ──> Real-time diagnostic evaluation based on patient health inputs
   ├── POST /predict1           ──> File-based evaluation from uploaded patient CSV records
   └── GET  /download-template  ──> Serves sample clinical CSV template (patient_template.csv)
             │
             ▼
[ Preprocessing & Inference Engine ]
   ├── StandardScaler (`standard_scaler.pkl`)
   ├── LabelEncoders (`label_encoders.pkl`)
   └── Trained ML / DL Suite:
       ├── Logistic Regression (`logreg.pkl`)
       ├── Decision Tree (`dt.pkl`)
       ├── Random Forest (`rf.pkl`)
       ├── Support Vector Machine (`svm.pkl`)
       ├── K-Nearest Neighbors (`knn.pkl`)
       └── Deep Neural Network (`nn_model.keras`)
```

---

## 📊 Machine Learning Models & Performance

The models were trained and benchmarked on clinical datasets using Accuracy, Precision, Recall, and F1-Score:

| Model | Accuracy (%) | Precision (%) | Recall (%) | F1 Score (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **99.39%** | **99.74%** | **99.48%** | **99.61%** |
| **Decision Tree** | 99.29% | 100.00% | 99.10% | 99.55% |
| **Neural Network (MLP)** | 99.19% | 99.36% | 99.61% | 99.49% |
| **K-Nearest Neighbors** | 96.54% | 98.56% | 97.04% | 97.79% |
| **Random Forest** | Evaluated | Evaluated | Evaluated | Evaluated |
| **Support Vector Machine (SVM)** | Evaluated | Evaluated | Evaluated | Evaluated |

---

## ✨ Key Features

- **Interactive Patient Health Details Form**:
  - Direct input of maternal and obstetric parameters: age, height, weight, live BMI calculation, gestational age, prior cesarean delivery history, fetal presentation, comorbidities, obstetric risk flags, and induction status.
  - Three quick-fill clinical scenario presets (*Normal Primiparous Term*, *Prior C-Section & Breech*, and *Gestational Comorbidity*).
- **Clinical Risk Stratification & Explanation**:
  - Calculates a clinical risk score (Low, Moderate, High Risk) alongside algorithm probability.
  - Highlights specific qualitative risk indicators (e.g., prior uterine scar, non-cephalic fetal presentation, advanced maternal age).
- **Self-Serve CSV Batch Upload**:
  - Upload clinical records (`.csv`) for instant evaluation with automatic feature alignment and NaN handling.
  - Downloadable sample template (`patient_template.csv`) directly accessible from the workbench or via API.
- **Modern Picture-Free Healthcare UI**:
  - Medical-grade aesthetic built with vector SVG icons (`@mui/icons-material`), glassmorphism navigation, and responsive cards.
- **Visual Analytics**:
  - Interactive confusion matrix charts powered by **Chart.js** (`react-chartjs-2`).
  - Comparative benchmark cards for all six algorithms.

---

## 📁 Project Structure

```text
C_SECTION_PREDICTOR/
├── client/                             # React Frontend (Picture-Free Modern UI)
│   ├── public/                         # Public assets, favicon, index.html
│   │   ├── favicon.ico
│   │   ├── index.html                  # HTML template with MaternaAI branding
│   │   ├── Logo.webp                   # Application favicon asset
│   │   ├── manifest.json
│   │   ├── patient_template.csv        # Downloadable sample patient CSV template
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.js                # Clinical hero & statistics overview
│   │   │   ├── Highlights.js           # Decision support core capability cards
│   │   │   ├── Model.js                # Model metrics grid & progress bars
│   │   │   ├── Navbar.js               # Glassmorphism header with MaternaAI branding
│   │   │   ├── Predict.js              # Diagnostic workbench (Patient Form & CSV Upload)
│   │   │   └── Visualize.js            # Chart.js confusion matrices & benchmarks
│   │   ├── App.js                      # Root React component & clinical footer
│   │   ├── App.css                     # Modern clinical SaaS design system
│   │   ├── results.json                # Model performance metrics data (6 models)
│   │   ├── index.js                    # React root entry point
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json                    # Frontend dependencies and scripts
│   └── package-lock.json
│
├── server/                             # Flask API & Trained Model Artifacts
│   ├── server.py                       # Flask server and REST prediction routes
│   ├── c_section.py                    # Training and preprocessing script
│   ├── c_section_multiway.py           # Multi-class experiment pipeline
│   ├── c_section_multiway.ipynb        # Multi-class experiment notebook
│   ├── dataset.xlsx                    # Original clinical dataset
│   ├── patient_template.csv            # Sample CSV template served by backend
│   ├── random_c_section_instance.csv   # Sample test CSV (C-Section record)
│   ├── random_normal_instance.csv      # Sample test CSV (Normal record)
│   ├── dt.pkl                          # Decision Tree model
│   ├── knn.pkl                         # K-Nearest Neighbors model
│   ├── logreg.pkl                      # Logistic Regression model
│   ├── rf.pkl                          # Random Forest model
│   ├── svm.pkl                         # Support Vector Machine (SVM) model
│   ├── nn_model.keras                  # Keras Deep Neural Network model
│   ├── normal_birth_instances.npy      # Pre-indexed normal birth reference vectors
│   ├── c_section_instances.npy         # Pre-indexed C-section reference vectors
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

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Activate the Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

   *(If setting up for the first time, install dependencies: `pip install -r requirements.txt` or `pip install flask flask-cors pandas scikit-learn tensorflow openpyxl`)*

3. Start the Flask server:
   ```bash
   python server.py
   ```
   *The API will start running at `http://localhost:5000`.*

---

### 2. Frontend Setup (React Client)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Start the React development server:
   - **Windows (PowerShell / Command Prompt)**:
     ```bash
     npm.cmd start
     ```
     *(or `cmd.exe /c "npm start"` if script execution is restricted in PowerShell)*
   - **Linux / macOS**:
     ```bash
     npm start
     ```
   *The React application will automatically open at `http://localhost:3000`.*

---

## 📡 API Endpoints

### `POST /predict`
Evaluates delivery outcome based on the patient's individual clinical and maternal health inputs.

* **URL**: `http://localhost:5000/predict`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
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
Processes an uploaded patient records file (`.csv`) with automatic column detection, support for the template format, and NaN imputation.

* **URL**: `http://localhost:5000/predict1`
* **Method**: `POST`
* **Request Type**: `multipart/form-data`
* **Form Fields**:
  - `file`: CSV file containing clinical features (e.g., `patient_template.csv`)
  - `model_name`: Algorithm identifier (`logistic_regression`, `decision_tree`, `random_forest`, `neural_network`, `svm`, `knn`)

* **Response** (`200 OK`):
  ```json
  {
    "prediction": 0,
    "birth_type": "Normal Vaginal Delivery",
    "probability": 0.082,
    "risk_level": "Low Risk",
    "summary": "Classified from clinical record (patient_template.csv).",
    "model_used": "logistic_regression"
  }
  ```

---

### `GET /download-template`
Serves a pre-formatted sample CSV template (`patient_template.csv`) for immediate testing and batch evaluation.

* **URL**: `http://localhost:5000/download-template`
* **Method**: `GET`
* **Response**: Binary CSV file attachment (`patient_template.csv`)

---

## 📋 Dataset & Clinical Features

The system evaluates diverse clinical parameters recorded during antenatal care and delivery:

- **Maternal Demographics & Anthropometry**: Age, Height, Weight, BMI, Gestational Age, Weight Gain.
- **Obstetric History**: Parity, Previous Cesarean Deliveries, Miscarriages, Previous Term/Preterm Deliveries.
- **Clinical Comorbidities & Risks**: Maternal Comorbidities (Hypertension, Diabetes), Obstetric Risk flags, Cardiotocography findings.
- **Labor & Delivery Factors**: Induction status, Ruptured Membranes duration (ROM), Amniotic Liquid classification, Robson Classification Group.
- **Fetal Metrics**: Fetal intrapartum presentation (cephalic vs. non-cephalic), Fetal pH, Estimated Birth Weight, Apgar Scores (1 min and 5 min).

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Material-UI (MUI v6) with `@mui/icons-material` (Vector SVG, picture-free design)
  - Bootstrap 5 & React-Bootstrap
  - Chart.js & React-Chartjs-2
  - Axios
- **Backend**:
  - Python 3.11
  - Flask & Flask-CORS
- **Machine Learning & Data Science**:
  - Scikit-learn (Logistic Regression, Decision Tree, Random Forest, SVM, KNN)
  - TensorFlow / Keras (Multi-Layer Perceptron / Neural Network)
  - Pandas, NumPy, OpenPyXL
  - Imbalanced-learn (SMOTE)
