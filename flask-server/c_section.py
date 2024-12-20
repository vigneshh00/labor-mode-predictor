

import pickle
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
import tensorflow as tf
import scikeras
import warnings
from tensorflow import get_logger
from scikeras.wrappers import KerasClassifier, KerasRegressor
import keras
from sklearn.ensemble import RandomForestClassifier
from sklearn import svm
from tensorflow.keras.layers import Dense,Input
from tensorflow.keras.models import Sequential



"""Preprocessing"""

from imblearn.over_sampling import SMOTE
from collections import Counter
df=pd.read_excel("Dataset.xlsx")
df.head()
df.columns=df.columns.str.strip().str.upper()

df = df.drop(columns=['COUPLE SITUATION', 'COUNTRY OF ORIGIN', 'MATERNAL EDUCATION', 'DAILY ALCOHOL INTAKE', 'PARITY'])

df['MEDICAL INDICATION'] = df['MEDICAL INDICATION'].str.strip().str.lower()
MEDICAL_INDICATION = {
    'agatamiento materno': 'maternal exhaustion',
    'expulsivo prolongado': 'prolonged second stage of labor',
    'patología materna': 'maternal pathology',
    'spbf': 'breech presentation'
}
df.replace({'MEDICAL INDICATION': MEDICAL_INDICATION}, inplace=True)

df['EMERGENCY CESAREAN SECTION'] = df['EMERGENCY CESAREAN SECTION'].str.strip().str.lower()
EMERGENCY_CESAREAN_SECTION = {
    'group 3. parto estacionado': 'parked delivery',
    'group 4. desproporción pelvifetal': 'pelvifetal disproportion',
    'group 2. fracaso de inducción': 'induction failure',
    'group 5. miscelanea': 'mixed',
    'group 1. rpbf': 'rpbf'
}
df.replace({'EMERGENCY CESAREAN SECTION': EMERGENCY_CESAREAN_SECTION}, inplace=True)

df['PROGRAMMED CESAREAN SECTION'] = df['PROGRAMMED CESAREAN SECTION'].str.strip().str.lower()
PROGRAMMED_CESAREAN_SECTION = {
    'placenta previa oclusiva': 'occlusive placenta previa',
    'presentación podalic': 'podalic presentation',
    'casos especiales': 'special cases',
    'cirugía uterina previa': 'previous uterine surgery',
    'presentación transversa': 'transverse presentation',
    'primer gemelo no cefálica': 'first non-cephalic twin',
    'riesgo fetal sin posibilidad de parto': 'fetal risk without possibility of delivery'
}
df.replace({'PROGRAMMED CESAREAN SECTION': PROGRAMMED_CESAREAN_SECTION}, inplace=True)

df['ARTHERIAL EMBOLIZATION'] = df['ARTHERIAL EMBOLIZATION'].str.strip().str.lower()
ARTHERIAL_EMBOLIZATION  = {
  'masculino': 'male',
  'femenino': 'female'
}
df.replace({'ARTHERIAL EMBOLIZATION' : ARTHERIAL_EMBOLIZATION }, inplace=True)

df['SEX FETUS 1'] = df['SEX FETUS 1'].str.strip().str.lower()
SEX_FETUS_1  = {
  'extrahospitalario': 'out of hospital'
}
df.replace({'SEX FETUS 1' : SEX_FETUS_1 }, inplace=True)

df['WEIGHT FETUS 1'] = df['WEIGHT FETUS 1'].str.strip().str.lower()
WEIGHT_FETUS_1  = {
  'desconocido': 'a stranger'
}
df.replace({'WEIGHT FETUS 1' : WEIGHT_FETUS_1 }, inplace=True)

df['EXITUSFETAL FETUS 1'] = df['EXITUSFETAL FETUS 1'].str.strip().str.lower()
EXITUSFETAL_FETUS_1  = {
  '0: no precisa': '0: not required',
  '1: aspiración nasofaríngea': '1: nasopharyngeal aspiration',
  '2: aspiración nasofaríngea con oxígeno': '2: nasopharyngeal aspiration with oxygen',
  '3: aspiración nasofaríngea con oxígeno y ambú': '3: nasopharyngeal aspiration with oxygen and ambu',
  '5: aspiración nasofaríngea con oxígeno, ambú, masaje cardíaco y fármacos': '5: nasopharyngeal aspiration with oxygen, ambu, cardiac massage and drugs'
}
df.replace({'EXITUSFETAL FETUS 1' : EXITUSFETAL_FETUS_1 }, inplace=True)

df['TYPE OF BIRTH'] = df['TYPE OF BIRTH'].str.strip().str.lower()
df['CLASSIFICATION OF BIRTH'] = df['TYPE OF BIRTH'].apply(lambda x: 'c-section' if x in ['emergency c-section', 'ces programmed'] else 'normal')

df[['TYPE OF BIRTH', 'CLASSIFICATION OF BIRTH']].head()
df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
df = df.dropna(axis=1, how='all')
imputer = SimpleImputer(strategy='most_frequent')
df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

c_section_df = df[df['CLASSIFICATION OF BIRTH'] == 'c-section']
normal_df = df[df['CLASSIFICATION OF BIRTH'] == 'normal']
c_section_df=c_section_df.drop(columns=["CLASSIFICATION OF BIRTH","TYPE OF BIRTH"])
normal_df=normal_df.drop(columns=["CLASSIFICATION OF BIRTH","TYPE OF BIRTH"])

c_section_df=pd.DataFrame(imputer.fit_transform(c_section_df),columns=c_section_df.columns)
normal_df=pd.DataFrame(imputer.fit_transform(normal_df),columns=normal_df.columns)
# Select a random instance from each group
random_c_section_instance = c_section_df.sample(n=1, random_state=42)
random_normal_instance = normal_df.sample(n=1, random_state=42)

# Save these instances as separate CSV files
random_c_section_instance.to_csv("random_c_section_instance.csv", index=False)
random_normal_instance.to_csv("random_normal_instance.csv", index=False)

label_encoders = {}
for column in df.select_dtypes(include='object').columns:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le

df['CLASSIFICATION OF BIRTH'] = df['CLASSIFICATION OF BIRTH'].replace({'c-section': 1, 'normal': 0})



X = df.drop(columns=['CLASSIFICATION OF BIRTH', 'TYPE OF BIRTH'])
y = df['CLASSIFICATION OF BIRTH']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)
smote=SMOTE(random_state=42)
X_resampled,y_resampled=smote.fit_resample(X_train,y_train)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_resampled)
X_test = scaler.transform(X_test)
y_train=y_resampled
# Creating separate NumPy arrays for normal birth and C-section instances
normal_birth_instances = X_test[y_test == 0]  
c_section_instances = X_test[y_test == 1]      

# Save them as NumPy files
np.save("normal_birth_instances.npy", normal_birth_instances)
np.save("c_section_instances.npy", c_section_instances)
with open('label_encoders.pkl', 'wb') as le_file:
    pickle.dump(label_encoders, le_file)

# Save the StandardScaler
with open('standard_scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)
"""K-Nearest Neighbors"""

print("KNN MODEL RESULTS")


knn = KNeighborsClassifier(n_neighbors=11)
knn.fit(X_train, y_train)
with open('KNN.pkl', 'wb') as file:
    pickle.dump(knn, file)
y_pred = knn.predict(X_test)

print("\nConfusion Matrix for KNN:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report for KNN:")
print(classification_report(y_test, y_pred))

KNN_accuracy = accuracy_score(y_test, y_pred)*100
KNN_precision = precision_score(y_test,y_pred)*100
KNN_recall = recall_score(y_test,y_pred)*100
KNN_f1score = f1_score(y_test,y_pred)*100
KNN_confusion_matrix = confusion_matrix(y_test,y_pred).tolist()
print(f"Accuracy of KNN: {KNN_accuracy:.2f}%")

"""Logistic Regression"""


print("LOGISTIC REGRESSION MODEL RESULTS")
logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train, y_train)
with open('Logreg.pkl', 'wb') as file:
    pickle.dump(logreg, file)

y_pred_logreg = logreg.predict(X_test)

print("\nConfusion Matrix for Logistic Regression:")
print(confusion_matrix(y_test, y_pred_logreg))
print("\nClassification Report for Logistic Regression:")
print(classification_report(y_test, y_pred_logreg))

logreg_accuracy = accuracy_score(y_test, y_pred_logreg)*100
logreg_precision = precision_score(y_test,y_pred_logreg)*100
logreg_recall = recall_score(y_test,y_pred_logreg)*100
logreg_f1score = f1_score(y_test,y_pred_logreg)*100
logreg_confusion_matrix = confusion_matrix(y_test,y_pred_logreg).tolist()
print(f"Accuracy of Logistic Regression: {logreg_accuracy:.2f}%")

"""Decision Tree"""

print("DECISION TREE MODEL RESULTS")
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
with open('dt.pkl', 'wb') as file:
    pickle.dump(dt, file)

y_pred_dt = dt.predict(X_test)

print("\nConfusion Matrix for Decision Tree Classifier:")
print(confusion_matrix(y_test, y_pred_dt))
print("\nClassification Report for Decision Tree Classifier:")
print(classification_report(y_test, y_pred_dt))

dectree_accuracy = accuracy_score(y_test, y_pred_dt)*100
dectree_precision = precision_score(y_test,y_pred_dt)*100
dectree_recall = recall_score(y_test,y_pred_dt)*100
dectree_f1score = f1_score(y_test,y_pred_dt)*100
dectree_confusion_matrix = confusion_matrix(y_test,y_pred_dt).tolist()
print(f"Accuracy of Decision Tree Classifier: {dectree_accuracy:.2f}%")

"""Neural Networks"""

np.random.seed(42)
tf.random.set_seed(42)

def create_model():
    model = Sequential()
    model.add(Input(shape=(49,)))
    model.add(Dense(6, kernel_initializer=tf.keras.initializers.GlorotNormal(seed=42), activation='relu'))
    model.add(Dense(4, kernel_initializer=tf.keras.initializers.GlorotNormal(seed=42), activation='relu'))
    model.add(Dense(1, kernel_initializer=tf.keras.initializers.GlorotNormal(seed=42), activation='sigmoid'))

    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

print("Neural network processing...")


estimator = KerasClassifier(model=create_model, epochs=30, batch_size=32, verbose=1, random_state=42)



estimator.fit(X_train, y_train)
model_to_save = estimator.model_
model_to_save.save("nn_model.keras")

neural_pred = estimator.predict(X_test)
nn_accuracy = accuracy_score(y_test, neural_pred)*100
nn_precision = precision_score(y_test,neural_pred)*100
nn_recall = recall_score(y_test,neural_pred)*100
nn_f1score = f1_score(y_test,neural_pred)*100
nn_confusion_matrix = confusion_matrix(y_test,neural_pred).tolist()
print(f"Accuracy of neural network: {nn_accuracy:.2f}%")

""" Random Forest Classifier """
rf = RandomForestClassifier()
rf.fit(X_train, y_train)
with open('rf.pkl', 'wb') as file:
    pickle.dump(rf, file)
y_pred_rf = rf.predict(X_test)


print("\nConfusion Matrix for Random forest Classifier:")
print(confusion_matrix(y_test, y_pred_rf))
print("\nClassification Report for Random forest Classifier:")
print(classification_report(y_test, y_pred_rf))

randomforest_accuracy = accuracy_score(y_test, y_pred_rf)*100
randomforest_precision = precision_score(y_test,y_pred_rf)*100
randomforest_recall = recall_score(y_test,y_pred_rf)*100
randomforest_f1score = f1_score(y_test,y_pred_rf)*100
randomforest_confusion_matrix = confusion_matrix(y_test,y_pred_rf).tolist()
print(f"Accuracy of Random Forest Classifier: {randomforest_accuracy:.2f}%")

"""SUPPORT VECTOR MACHINE"""
clf = svm.SVC(kernel='linear')
clf.fit(X_train, y_train)
with open('clf.pkl', 'wb') as file:
    pickle.dump(clf, file)
y_pred_clf = clf.predict(X_test)

print("\nConfusion Matrix for Support Vector Machine:")
print(confusion_matrix(y_test, y_pred_clf))
print("\nClassification Report for Support Vector Machine:")
print(classification_report(y_test, y_pred_clf))


svm_accuracy = accuracy_score(y_test, y_pred_clf)*100
svm_precision = precision_score(y_test,y_pred_clf)*100
svm_recall = recall_score(y_test,y_pred_clf)*100
svm_f1score = f1_score(y_test,y_pred_clf)*100
svm_confusion_matrix = confusion_matrix(y_test,y_pred_clf).tolist()
print(f"Accuracy of Support Vector Machine: {svm_accuracy:.2f}%")

results = {
    "K Nearest Neighbours": {
        "accuracy": KNN_accuracy,
        "precision": KNN_precision,
        "recall": KNN_recall,
        "f1_score": KNN_f1score,
        "confusion_matrix": KNN_confusion_matrix
    },
    "Decision Tree": {
        "accuracy": dectree_accuracy,
        "precision": dectree_precision,
        "recall": dectree_recall,
        "f1_score": dectree_f1score,
        "confusion_matrix": dectree_confusion_matrix
    },
    "Logistic Regression": {
        "accuracy": logreg_accuracy,
        "precision": logreg_precision,
        "recall": logreg_recall,
        "f1_score": logreg_f1score,
        "confusion_matrix": logreg_confusion_matrix
    },
    "Neural Network":{
      "accuracy": nn_accuracy,
        "precision": nn_precision,
        "recall": nn_recall,
        "f1_score": nn_f1score,
        "confusion_matrix":nn_confusion_matrix
    },
    "Random Forest":{
        "accuracy": randomforest_accuracy,
        "precision": randomforest_precision,
        "recall": randomforest_recall,
        "f1_score": randomforest_f1score,
        "confusion_matrix":randomforest_confusion_matrix
    },
    "Support Vector Machine":{
        "accuracy": svm_accuracy,
        "precision": svm_precision,
        "recall": svm_recall,
        "f1_score": svm_f1score,
        "confusion_matrix":svm_confusion_matrix
    }
}


import json
with open("../Client/src/results.json", "w") as f:
    json.dump(results, f)
