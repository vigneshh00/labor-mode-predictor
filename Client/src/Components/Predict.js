import React, { useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import Form from "react-bootstrap/Form";

const Predict = React.forwardRef((props, ref) => {

  const [birthType, setBirthType] = useState("");
  const [model, setModel] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [model1, setModel1] = useState("");
  const [predictionResult1, setPredictionResult1] = useState(null);
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handlePredict1 = async (event) => {
    event.preventDefault();

    if (!file || !model1) {
      alert("Please upload a file and select a model.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_name", model1);

      const response = await axios.post("http://localhost:5000/predict1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from server:", response.data);
      setPredictionResult1(response.data);
      setError1(null);
    } catch (error) {
      console.error("Prediction error:", error);
      if (error.response) {
        setError(
          error.response.data.error ||
          "There was an error getting the prediction."
        );
      } else {
        setError1("There was an error getting the prediction.");
      }
    }
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    console.log("Form submitted with:", { birthType, model });

    if (!birthType || !model) {
      alert("Please select both birth type and model.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        birth_type: birthType,
        model_name: model,
      });
      console.log("Response from server:", response.data);
      setPredictionResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Prediction error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        setError(
          error.response.data.error ||
          "There was an error getting the prediction."
        );
      } else {
        setError("There was an error getting the prediction.");
      }
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center">
      <div
        ref={ref}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "100px",
        }}
      >
        <h2 style={{ marginBottom: '50px' }}>Predict</h2>
        <Form onSubmit={handlePredict} style={{ width: "300px" }}>
          <Form.Label>Select Birth Type</Form.Label>
          <Form.Select
            aria-label="Default select example"
            value={birthType}
            onChange={(e) => setBirthType(e.target.value)}
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <option value="">--Choose--</option>
            <option value="normal">Normal Birth</option>
            <option value="c-section">C-Section</option>
          </Form.Select>

          <Form.Label>Select Model:</Form.Label>
          <Form.Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <option value="">--Choose--</option>
            <option value="knn">K-Nearest Neighbors</option>
            <option value="logistic_regression">Logistic Regression</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="neural_network">Neural Network</option>
            <option value="random_forest">Random Forest Classifier</option>
            <option value="svm">Support Vector Machine</option>
          </Form.Select>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button
              sx={{
                backgroundColor: "#301934",
                "&:hover": {
                  backgroundColor: "#4e1b3c",
                },
              }}
              type="submit"
            >
              <Typography sx={{ color: "#ffe6e6" }}>Predict</Typography>
            </Button>
          </div>
        </Form>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {predictionResult && (
          <div style={{ paddingTop: "50px" }}>
            <h3>Prediction Result:</h3>
            <p>Prediction: {predictionResult.prediction}</p>
            <p>Birth Type: {predictionResult.birth_type}</p>
          </div>
        )}
      </div>
      <div
        ref={ref}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "100px",
        }}
      >
        <h2 style={{ marginBottom: "50px" }}>Predict using file</h2>
        <Form onSubmit={handlePredict1} style={{ width: "300px" }}>
          <Form.Label>Upload CSV File:</Form.Label>
          <Form.Control
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: "15px" }}
          />

          <Form.Label>Select Model:</Form.Label>
          <Form.Select
            value={model1}
            onChange={(e) => setModel1(e.target.value)}
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <option value="">--Choose--</option>
            <option value="knn">K-Nearest Neighbors</option>
            <option value="logistic_regression">Logistic Regression</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="neural_network">Neural Network</option>
            <option value="random_forest">Random Forest Classifier</option>
            <option value="svm">Support Vector Machine</option>
          </Form.Select>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
            <Button
              sx={{
                backgroundColor: "#301934",
                "&:hover": {
                  backgroundColor: "#4e1b3c",
                },
              }}
              type="submit"
            >
              <Typography sx={{ color: "#ffe6e6" }}>Predict</Typography>
            </Button>
          </div>
        </Form>

        {error1 && <div style={{ color: "red" }}>{error1}</div>}

        {predictionResult1 && (
          <div style={{ paddingTop: "50px" }}>
            <h3>Prediction Result:</h3>
            <p>Prediction: {predictionResult1.prediction}</p>
            <p>Birth Type: {predictionResult1.birth_type}</p>
          </div>
        )}
      </div>
    </section>

  );
});

export default Predict;
