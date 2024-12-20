from flask import Flask, request, jsonify
import random
import pickle
import joblib
import numpy as np
from tensorflow.keras.models import load_model
import pandas as pd
from flask_cors import CORS  

app = Flask(__name__)

CORS(app)  

with open('KNN.pkl', 'rb') as file:
    knn_model = pickle.load(file)
with open('dt.pkl', 'rb') as file:
    dt_model = pickle.load(file)
with open('Logreg.pkl', 'rb') as file:
    logreg_model = pickle.load(file)
with open('rf.pkl','rb') as file:
    rf_model = pickle.load(file)
with open('clf.pkl','rb') as file:
    clf_model = pickle.load(file)
nn_model = load_model("nn_model.keras")

with open('label_encoders.pkl', 'rb') as le_file:
    loaded_label_encoders = pickle.load(le_file)
with open('standard_scaler.pkl', 'rb') as scaler_file:
    loaded_scaler = pickle.load(scaler_file)

normal_birth_instances = np.load("normal_birth_instances.npy")
c_section_instances = np.load("c_section_instances.npy")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        model_type = data.get('model_name')  
        birth_class = data.get('birth_type')
        print(f"Received birth type: {birth_class}, model: {model_type}")

        if birth_class == 'normal':
            features = np.array(random.choice(normal_birth_instances))
        elif birth_class == 'c-section':
            features = np.array(random.choice(c_section_instances))
        else:
            return jsonify({"error": "Invalid birth class specified"}), 400
        
        print(features)
        features = features.reshape(1, -1)  

        if model_type == 'knn':
            prediction = knn_model.predict(features)
            print("Predicted using knn")
        elif model_type == 'logistic_regression':
            prediction = logreg_model.predict(features)
            print("Predicted using logreg")
        elif model_type == 'decision_tree':
            prediction = dt_model.predict(features)
            print("Predicted using dectree")
        elif model_type == 'neural_network':
            prediction = (nn_model.predict(features) > 0.5).astype("int32")
            print("Predicted using neural network")
        elif model_type == 'random_forest':
            prediction = (rf_model.predict(features))
        elif model_type == 'svm':
            prediction = (clf_model.predict(features))
        else:
            return jsonify({"error": "Invalid model type specified"}), 400
        
        print(f"Prediction result: {prediction[0]}")
       
        birth_type = "Normal" if prediction[0] == 0 else "C-section"
        
        return jsonify({
            "prediction": int(prediction[0]),
            "birth_type": birth_type,
            "features": features.flatten().tolist()  
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500 

@app.route('/predict1', methods=['POST'])
def predict1():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['file']
        model_type1 = request.form.get('model_name')

        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400

        if not model_type1:
            return jsonify({"error": "Model type not specified"}), 400

        try:
            data = pd.read_csv(file)
            for column in data.select_dtypes(include='object').columns:
                data[column] = loaded_label_encoders[column].transform(data[column])
            
            X = data.values
            features1 = loaded_scaler.transform(X)
            print(features1) 
        except Exception as e:
            return jsonify({"error": f"Error reading CSV file: {str(e)}"}), 400

        if len(features1.shape) == 1:
            features1 = features1.reshape(1, -1)  

        if model_type1 == 'knn':
            prediction = knn_model.predict(features1)
            print("Predicted using knn")
        elif model_type1 == 'logistic_regression':
            prediction = logreg_model.predict(features1)
            print("Predicted using logreg")
        elif model_type1 == 'decision_tree':
            prediction = dt_model.predict(features1)
            print("Predicted using dectree")
        elif model_type1 == 'neural_network':
            prediction = (nn_model.predict(features1) > 0.5).astype("int32")
            print("Predicted using neural network")
        elif model_type1 == 'random_forest':
            prediction = (rf_model.predict(features1))
        elif model_type1 == 'svm':
            prediction = (clf_model.predict(features1))
        else:
            return jsonify({"error": "Invalid model type specified"}), 400
        
        print(f"Prediction result: {prediction[0]}")

        birth_type = "Normal" if prediction[0] == 0 else "C-section"
        
        return jsonify({
            "prediction": int(prediction[0]),
            "birth_type": birth_type
        })


    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
