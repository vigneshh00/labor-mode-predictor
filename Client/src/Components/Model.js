import React, { useEffect, useState } from "react";
import modelsData from "../results.json";
import { Box, Typography } from "@mui/material";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Model = React.forwardRef((props, ref) => {
  const [models, setModelsData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 

  useEffect(() => {
    const formattedModels = Object.entries(modelsData).map(([name, metrics]) => ({
      name,
      metrics: [
        `Accuracy: ${metrics.accuracy.toFixed(2)}%`,
        `Precision: ${metrics.precision.toFixed(2)}%`,
        `Recall: ${metrics.recall.toFixed(2)}%`,
        `F1 Score: ${metrics.f1_score.toFixed(2)}%`,
      ],
      description:
        name === "K Nearest Neighbours"
          ? "A simple and effective algorithm for classification problems."
          : name === "Decision Tree"
          ? "A model that makes decisions based on feature splits."
          : name === "Logistic Regression"
          ? "A statistical model used for binary classification."
          : name === "Neural Network"
          ? "A model inspired by the human brain structure for complex tasks."
          : name === "Random Forest"
          ? "An ensemble learning method that builds multiple decision trees and combines their outputs for robust predictions."
          : "A supervised learning algorithm that finds the optimal hyperplane to classify data points into categories."
    }));
    setModelsData(formattedModels);
  }, []);

  return (
    <div ref={ref} style={{ height: "100vh", paddingTop: "80px" }}>
      <h2 style={{ textAlign: "center" }}>Models</h2>
      <Container style={{paddingTop:'80px'}}>
        {models.map((model, index) => (
          index % 2 === 0 && (
            <Row key={index} className="mb-4">
              {[index, index + 1].map(i => (
                models[i] && (
                  <Col key={i}>
                    <Box
                      border={1}
                      padding={2}
                      borderRadius={2}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        transition: "transform 0.3s ease, filter 0.5s ease",
                        transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)",
                        backgroundColor: hoveredIndex === i ? "#301934" : '#ffe6e6',
                      }}
                    >
                      <Typography variant="h6" style={{ fontWeight: "bold", color: hoveredIndex === i ? '#ffe6e6' : "#301934" }}>
                        {models[i].name}
                      </Typography>
                      <Typography variant="body2" style={{color: hoveredIndex === i ? '#ffe6e6' : "#301934"}}>
                        {models[i].description}
                      </Typography>
                      <ul style={{ paddingLeft: "20px", marginTop: "10px", color: hoveredIndex === i ? '#ffe6e6' : "#301934" }}>
                        {models[i].metrics.map((metric, j) => (
                          <li key={j} style={{color: hoveredIndex === i ? '#ffe6e6' : "#301934"}}>
                            <Typography variant="body2">{metric}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </Col>
                )
              ))}
            </Row>
          )
        ))}
      </Container>
    </div>
  );
});

export default Model;
