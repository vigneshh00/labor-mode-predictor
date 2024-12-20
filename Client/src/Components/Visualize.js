import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import modelsData from "../results.json"; 
import confusionMatrixImg from "../Landing Page Assets/confusion-matrix.png";
import precisionRecallImg from "../Landing Page Assets/precision-recall.png";
import modelComparisionImg from "../Landing Page Assets/model-comparision.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  
  LineElement,   
  Title,
  Tooltip,
  Legend
);
const Visualize = React.forwardRef((props, ref) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedVisualization, setSelectedVisualization] = useState(null);

  const boxStyle = {
    padding: 2,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: "#301536",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
  };


  const generateChartData = (confusionMatrix) => {
    return {
      labels: ["Predicted 0", "Predicted 1"],
      datasets: [
        {
          label: "True 0",
          data: confusionMatrix[0], 
          backgroundColor: "#FF5733",
          borderColor: "#FF5733",
          borderWidth: 1,
        },
        {
          label: "True 1",
          data: confusionMatrix[1], 
          backgroundColor: "#33FF57", 
          borderColor: "#33FF57",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Confusion Matrix",
        font: {
          size: 16,
        },
        color: "#ffe6e6",
      },
      legend: {
        labels: {
          color: "#ffe6e6",
        },
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#ffe6e6" },
      },
      y: {
        stacked: true,
        ticks: { color: "#ffe6e6" },
      },
    },
  };
  const chartOptions_2 = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Model Comparison",
        font: {
          size: 16,
        },
        color: "#ffe6e6",
      },
      legend: {
        labels: {
          color: "#ffe6e6",
        },
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#ffe6e6" },
        categoryPercentage: 0.5, 
    barPercentage: 0.8, 
      },
      y: {
        stacked: true,
        ticks: { color: "#ffe6e6" },
      },
    },
  };



  const generateModelComparisonData = (metric) => {
    const labels = Object.keys(modelsData);
    const data = labels.map((model) => modelsData[model][metric]);

    return {
      labels,
      datasets: [
        {
          label: metric,
          data,
          backgroundColor: metric === "accuracy" ? "#FF5733" : metric === "precision" ? "green" : metric === "recall" ? "blue" : "orange",
          borderColor: metric === "accuracy" ? "#FF5733" : metric === "precision" ? "green" : metric === "recall" ? "blue" : "orange",
          borderWidth: 1,
        },
      ],
    };
  };


  return (
    <>
      {selectedVisualization === null && (
        <div ref={ref} style={{ height: "100vh", paddingTop: "80px" }}>
          <h2 style={{ textAlign: "center" }}>Visualize</h2>
          <Container style={{ paddingTop: "70px" }}>
            <Row>
              <Col>
                <Box
                  sx={{
                    ...boxStyle,
                    transform: hoverIndex === 1 ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoverIndex(1)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => setSelectedVisualization("confusion matrix")}
                >
                  <Box
                    component="img"
                    src={confusionMatrixImg}
                    sx={{ height: "100px" }}
                  />
                  <Typography
                    variant="body2"
                    style={{ color: "#ffe6e6", paddingTop: "20px" }}
                    sx={{fontSize:'22px'}}
                  >
                    Confusion Matrix
                  </Typography>
                </Box>
              </Col>
              <Col>
                <Box
                  sx={{
                    ...boxStyle,
                    transform: hoverIndex === 3 ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoverIndex(3)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={()=>setSelectedVisualization("model comparison")}
                >
                  <Box
                    component="img"
                    src={modelComparisionImg}
                    sx={{ height: "100px" }}
                  />
                  <Typography
                    variant="body2"
                    style={{ color: "#ffe6e6", paddingTop: "20px" }}
                  sx={{fontSize:'22px'}}
                  >
                    Model Comparison
                  </Typography>
                </Box>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {selectedVisualization === "confusion matrix" && (
        <div
          style={{
            height: "auto",
            paddingTop: "80px",
            backgroundColor: "#ffe6e6",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Confusion Matrices for All Models
          </h2>
          <Container style={{ paddingTop: "40px" }}>
            <Row>
              {Object.keys(modelsData).map((model, index) => (
                <Col key={model} xs={12} md={6}>
                  <Box
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: "#301536",
                      marginBottom: "20px",
                      color: "#ffe6e6",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: "#ffe6e6",
                        textAlign: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {model}
                    </Typography>
                    <Bar
                      data={generateChartData(
                        modelsData[model].confusion_matrix
                      )}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: `${model} - Confusion Matrix`,
                            font: { size: 14, color: "#ffe6e6" },
                          },
                        },
                        scales: {
                          x: {
                            ticks: { color: "#ffe6e6" },
                          },
                          y: {
                            ticks: { color: "#ffe6e6" },
                          },
                        },
                      }}
                    />
                  </Box>
                </Col>
              ))}
            </Row>
          </Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#301536",
                color: "#ffe6e6",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
              onClick={() => setSelectedVisualization(null)}
            >
              Back
            </button>
          </div>
        </div>
      )}
       {selectedVisualization === "model comparison" && (
        <div
          style={{
            height: "auto",
            paddingTop: "80px",
            backgroundColor: "#ffe6e6",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Model Comparison for All Metrics
          </h2>
          <Container style={{ paddingTop: "40px" }}>
            <Row>
              
              <Col xs={12} md={6}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#301536",
                    marginBottom: "20px",
                    color: "#ffe6e6",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "#ffe6e6",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Accuracy 
                  </Typography>
                  <Bar
                    data={generateModelComparisonData("accuracy")}
                    options={chartOptions_2}
                  />
                </Box>
              </Col>
              <Col xs={12} md={6}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#301536",
                    marginBottom: "20px",
                    color: "#ffe6e6",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "#ffe6e6",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Precision 
                  </Typography>
                  <Bar
                    data={generateModelComparisonData("precision")}
                    options={chartOptions_2}
                  />
                </Box>
              </Col>
            </Row>

            
            <Row>
              <Col xs={12} md={6}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#301536",
                    marginBottom: "20px",
                    color: "#ffe6e6",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "#ffe6e6",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Recall 
                  </Typography>
                  <Bar
                    data={generateModelComparisonData("recall")}
                    options={chartOptions_2}
                  />
                </Box>
              </Col>
              <Col xs={12} md={6}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#301536",
                    marginBottom: "20px",
                    color: "#ffe6e6",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "#ffe6e6",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    F1 Score 
                  </Typography>
                  <Bar
                    data={generateModelComparisonData("f1_score")}
                    options={chartOptions_2}
                  />
                </Box>
              </Col>
            </Row>
          </Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#301536",
                color: "#ffe6e6",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
              onClick={() => setSelectedVisualization(null)}
            >
              Back
            </button>
          </div>
        </div>
      )}

    </>
  );
});

export default Visualize;
