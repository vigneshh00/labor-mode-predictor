from flask import Flask, request, jsonify, send_file
import pickle
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load trained models
with open('knn.pkl', 'rb') as file:
    knn_model = pickle.load(file)
with open('dt.pkl', 'rb') as file:
    dt_model = pickle.load(file)
with open('logreg.pkl', 'rb') as file:
    logreg_model = pickle.load(file)
with open('rf.pkl', 'rb') as file:
    rf_model = pickle.load(file)
with open('svm.pkl', 'rb') as file:
    svm_model = pickle.load(file)
nn_model = load_model("nn_model.keras")

# Load preprocessing artifacts
with open('label_encoders.pkl', 'rb') as le_file:
    loaded_label_encoders = pickle.load(le_file)
with open('standard_scaler.pkl', 'rb') as scaler_file:
    loaded_scaler = pickle.load(scaler_file)

# Load pre-indexed population distribution vectors
normal_birth_instances = np.load("normal_birth_instances.npy")
c_section_instances = np.load("c_section_instances.npy")
mean_norm_vector = normal_birth_instances.mean(axis=0)
mean_csec_vector = c_section_instances.mean(axis=0)

feature_cols = list(loaded_scaler.feature_names_in_)
age_idx = feature_cols.index('AGE') if 'AGE' in feature_cols else 0
height_idx = feature_cols.index('HEIGHT') if 'HEIGHT' in feature_cols else 1
weight_idx = feature_cols.index('WEIGHT') if 'WEIGHT' in feature_cols else 2
bmi_idx = feature_cols.index('BMI') if 'BMI' in feature_cols else 3
gest_idx = feature_cols.index('GESTAGIONAL AGE') if 'GESTAGIONAL AGE' in feature_cols else 26


def evaluate_clinical_factors(patient_dict):
    """Calculates obstetric risk indicators and produces qualitative risk factors."""
    risk_factors = []
    clinical_risk_score = 0.05

    # 1. Previous Cesarean History
    prev_cs_val = str(patient_dict.get('previous_cesarean', '')).lower()
    num_prev_cs = 0
    try:
        num_prev_cs = int(patient_dict.get('num_previous_cesarean', 0))
    except (ValueError, TypeError):
        pass

    if prev_cs_val in ['yes', 'true', 't', '1'] or num_prev_cs > 0:
        if num_prev_cs >= 2:
            clinical_risk_score += 0.85
            risk_factors.append(f"Multiple previous cesarean deliveries ({num_prev_cs} prior C-sections)")
        else:
            clinical_risk_score += 0.55
            risk_factors.append("Previous cesarean section history (prior uterine scar)")

    # 2. Fetal Presentation & Indication
    pres_val = str(patient_dict.get('fetal_presentation', patient_dict.get('presentation', 'cephalic'))).lower()
    if any(k in pres_val for k in ['breech', 'podalic', 'transverse', 'non-cephalic']):
        clinical_risk_score += 0.60
        risk_factors.append("Non-cephalic fetal presentation (breech / transverse)")
    elif any(k in pres_val for k in ['stalled', 'dystocia', 'parked', 'failure', 'distress', 'rpbf']):
        clinical_risk_score += 0.50
        risk_factors.append("Labor complication / fetal distress indication")

    # 3. Comorbidities
    comorb_val = str(patient_dict.get('comorbidity', '')).lower()
    if comorb_val in ['yes', 'true', 't', '1']:
        clinical_risk_score += 0.15
        risk_factors.append("Maternal comorbidity present (e.g. hypertension / diabetes)")

    # 4. Obstetric Risk Flag
    obs_val = str(patient_dict.get('obstetric_risk', '')).lower()
    if obs_val in ['yes', 'true', 't', 'high', '1']:
        clinical_risk_score += 0.15
        risk_factors.append("High obstetric risk profile flagged")

    # 5. Age & BMI
    try:
        age = float(patient_dict.get('age', 28))
        if age >= 40:
            clinical_risk_score += 0.12
            risk_factors.append(f"Advanced maternal age ({int(age)} years)")
        elif age >= 35:
            clinical_risk_score += 0.08
            risk_factors.append(f"Maternal age >= 35 ({int(age)} years)")
    except (ValueError, TypeError):
        age = 28.0

    try:
        height = float(patient_dict.get('height_cm', patient_dict.get('height', 165)))
        if height > 3:
            height_m = height / 100.0
        else:
            height_m = height

        weight = float(patient_dict.get('weight_kg', patient_dict.get('weight', 65)))
        bmi = float(patient_dict.get('bmi', weight / (height_m ** 2)))
        if bmi >= 35:
            clinical_risk_score += 0.12
            risk_factors.append(f"Class II+ Maternal Obesity (BMI {bmi:.1f})")
        elif bmi >= 30:
            clinical_risk_score += 0.08
            risk_factors.append(f"Maternal Obesity (BMI {bmi:.1f})")
    except (ValueError, TypeError):
        pass

    # 6. Gestational Age
    try:
        gest = float(patient_dict.get('gestational_age_weeks', patient_dict.get('gestational_age', 39)))
        if gest < 34:
            clinical_risk_score += 0.25
            risk_factors.append(f"Moderate-to-late preterm labor ({int(gest)} weeks)")
        elif gest > 41:
            clinical_risk_score += 0.10
            risk_factors.append(f"Post-term pregnancy ({int(gest)} weeks)")
    except (ValueError, TypeError):
        pass

    if not risk_factors:
        risk_factors.append("Normal cephalic term pregnancy with no prior uterine scars")

    return clinical_risk_score, risk_factors


def build_patient_scaled_vector(patient_dict, clinical_risk_score):
    """Blends population feature distributions and overlays patient-specific continuous metrics."""
    risk_weight = min(max(clinical_risk_score, 0.0), 1.0)
    vec = (1.0 - risk_weight) * mean_norm_vector + risk_weight * mean_csec_vector

    # Overlay user-provided physical continuous variables
    try:
        age = float(patient_dict.get('age', 28))
        vec[age_idx] = (age - loaded_scaler.mean_[age_idx]) / loaded_scaler.scale_[age_idx]
    except (ValueError, TypeError):
        pass

    try:
        height = float(patient_dict.get('height_cm', patient_dict.get('height', 165)))
        if height > 3:
            height_m = height / 100.0
        else:
            height_m = height
        vec[height_idx] = (height_m - loaded_scaler.mean_[height_idx]) / loaded_scaler.scale_[height_idx]

        weight = float(patient_dict.get('weight_kg', patient_dict.get('weight', 65)))
        vec[weight_idx] = (weight - loaded_scaler.mean_[weight_idx]) / loaded_scaler.scale_[weight_idx]

        bmi = float(patient_dict.get('bmi', weight / (height_m ** 2)))
        vec[bmi_idx] = (bmi - loaded_scaler.mean_[bmi_idx]) / loaded_scaler.scale_[bmi_idx]
    except (ValueError, TypeError):
        pass

    try:
        gest = float(patient_dict.get('gestational_age_weeks', patient_dict.get('gestational_age', 39)))
        vec[gest_idx] = (gest - loaded_scaler.mean_[gest_idx]) / loaded_scaler.scale_[gest_idx]
    except (ValueError, TypeError):
        pass

    return vec.reshape(1, -1)


def run_model_inference(features_scaled, model_type):
    """Executes prediction on the chosen algorithm and computes probabilities."""
    models_dict = {
        'knn': knn_model,
        'logistic_regression': logreg_model,
        'decision_tree': dt_model,
        'random_forest': rf_model,
        'svm': svm_model,
    }

    if model_type == 'neural_network':
        prob = float(nn_model.predict(features_scaled, verbose=0)[0][0])
        pred = int(prob > 0.5)
    else:
        m = models_dict.get(model_type, logreg_model)
        pred = int(m.predict(features_scaled)[0])
        if hasattr(m, 'predict_proba'):
            prob = float(m.predict_proba(features_scaled)[0][1])
        else:
            prob = 0.90 if pred == 1 else 0.10

    return pred, prob


@app.route('/predict', methods=['POST'])
def predict():
    """Interactive Patient Form Endpoint: Receives structured patient details."""
    try:
        data = request.get_json() or {}
        model_type = data.get('model_name', 'logistic_regression')

        # Calculate clinical risk score and factors from patient details
        clinical_risk_score, risk_factors = evaluate_clinical_factors(data)

        # Build feature vector for ML model
        features_scaled = build_patient_scaled_vector(data, clinical_risk_score)

        # Run inference
        pred, prob = run_model_inference(features_scaled, model_type)

        # High clinical risk overrides when strong indications are present (e.g. breech, multiple C-sections)
        if clinical_risk_score >= 0.70:
            pred = 1
            prob = max(prob, 0.85)
        elif clinical_risk_score <= 0.20:
            pred = 0
            prob = min(prob, 0.25)

        is_csec = (pred == 1)
        birth_type = "Cesarean Section (C-Section)" if is_csec else "Normal Vaginal Delivery"
        risk_level = "High Risk" if clinical_risk_score >= 0.60 else "Moderate Risk" if clinical_risk_score >= 0.30 else "Low Risk"

        summary = (
            "Clinical indications and patient profile suggest an elevated probability of requiring a cesarean delivery."
            if is_csec else
            "Patient parameters and clinical metrics support a favorable trajectory for spontaneous vaginal birth."
        )

        return jsonify({
            "prediction": pred,
            "birth_type": birth_type,
            "probability": round(prob, 3),
            "risk_score": round(clinical_risk_score, 2),
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "summary": summary,
            "model_used": model_type
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict1', methods=['POST'])
def predict1():
    """CSV File Upload Endpoint: Supports both template patient CSVs and full research CSVs."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded in the request"}), 400

        file = request.files['file']
        model_type = request.form.get('model_name', 'logistic_regression')

        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400

        df_upload = pd.read_csv(file)
        if df_upload.empty:
            return jsonify({"error": "Uploaded CSV file is empty"}), 400

        # Case A: User uploaded template CSV or simplified patient columns
        first_row = df_upload.iloc[0].to_dict()
        normalized_keys = {str(k).strip().lower(): v for k, v in first_row.items()}

        if 'age' in normalized_keys and ('weight_kg' in normalized_keys or 'weight' in normalized_keys or 'gestational_age_weeks' in normalized_keys):
            patient_data = {
                'age': normalized_keys.get('age', 28),
                'height_cm': normalized_keys.get('height_cm', normalized_keys.get('height', 165)),
                'weight_kg': normalized_keys.get('weight_kg', normalized_keys.get('weight', 65)),
                'gestational_age_weeks': normalized_keys.get('gestational_age_weeks', normalized_keys.get('gestational_age', 39)),
                'previous_cesarean': normalized_keys.get('previous_cesarean', 'no'),
                'num_previous_cesarean': normalized_keys.get('num_previous_cesarean', 0),
                'comorbidity': normalized_keys.get('comorbidity', 'no'),
                'obstetric_risk': normalized_keys.get('obstetric_risk', 'low'),
                'fetal_presentation': normalized_keys.get('fetal_presentation', 'cephalic'),
            }
            clinical_risk_score, risk_factors = evaluate_clinical_factors(patient_data)
            features_scaled = build_patient_scaled_vector(patient_data, clinical_risk_score)
            pred, prob = run_model_inference(features_scaled, model_type)

            if clinical_risk_score >= 0.70:
                pred = 1
                prob = max(prob, 0.85)
            elif clinical_risk_score <= 0.20:
                pred = 0
                prob = min(prob, 0.25)

            is_csec = (pred == 1)
            birth_type = "Cesarean Section (C-Section)" if is_csec else "Normal Vaginal Delivery"
            risk_level = "High Risk" if clinical_risk_score >= 0.60 else "Moderate Risk" if clinical_risk_score >= 0.30 else "Low Risk"

            return jsonify({
                "prediction": pred,
                "birth_type": birth_type,
                "probability": round(prob, 3),
                "risk_score": round(clinical_risk_score, 2),
                "risk_level": risk_level,
                "risk_factors": risk_factors,
                "summary": f"Processed successfully from uploaded patient file ({file.filename}).",
                "model_used": model_type
            })

        # Case B: Standard 49-column research CSV format
        # Strip and clean headers
        df_upload.columns = df_upload.columns.str.strip().str.upper()

        # Check required columns
        for col in feature_cols:
            if col not in df_upload.columns:
                df_upload[col] = 'nan'

        # Ensure order matches scaler
        df_upload = df_upload[feature_cols]

        # Impute and encode cleanly
        vec = []
        row_dict = df_upload.iloc[0].to_dict()
        for col in feature_cols:
            val = str(row_dict.get(col, '')).strip()
            if col in loaded_label_encoders:
                le = loaded_label_encoders[col]
                if val in le.classes_:
                    vec.append(le.transform([val])[0])
                elif 'nan' in le.classes_:
                    vec.append(le.transform(['nan'])[0])
                else:
                    vec.append(le.transform([le.classes_[0]])[0])
            else:
                try:
                    vec.append(float(val) if pd.notna(val) else 0.0)
                except:
                    vec.append(0.0)

        features1 = loaded_scaler.transform(np.array(vec).reshape(1, -1))
        pred, prob = run_model_inference(features1, model_type)
        birth_type = "Cesarean Section (C-Section)" if pred == 1 else "Normal Vaginal Delivery"

        return jsonify({
            "prediction": int(pred),
            "birth_type": birth_type,
            "probability": round(prob, 3),
            "risk_level": "High Risk" if pred == 1 else "Low Risk",
            "summary": f"Classified from clinical record ({file.filename}).",
            "model_used": model_type
        })

    except Exception as e:
        return jsonify({"error": f"Failed to process CSV file: {str(e)}"}), 500


@app.route('/download-template', methods=['GET'])
def download_template():
    """Serves the sample patient template CSV for user download."""
    csv_path = os.path.abspath('patient_template.csv')
    if os.path.exists(csv_path):
        return send_file(csv_path, as_attachment=True, download_name="patient_template.csv")
    return jsonify({"error": "Template file not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
