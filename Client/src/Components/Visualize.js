import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import modelsData from '../results.json';
import GridViewIcon from '@mui/icons-material/GridView';
import BarChartIcon from '@mui/icons-material/BarChart';

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
  const [visMode, setVisMode] = useState('comparison'); // 'comparison' | 'confusion'
  const [activeMetric, setActiveMetric] = useState('accuracy');

  // Chart configuration for Confusion Matrices
  const generateConfusionData = (matrix) => {
    return {
      labels: ['Predicted Normal', 'Predicted C-Section'],
      datasets: [
        {
          label: 'Actual Normal Delivery (0)',
          data: matrix[0],
          backgroundColor: '#0ea5e9',
          borderRadius: 6,
        },
        {
          label: 'Actual C-Section Delivery (1)',
          data: matrix[1],
          backgroundColor: '#f43f5e',
          borderRadius: 6,
        },
      ],
    };
  };

  const confusionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
          boxWidth: 14,
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: '700' },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { weight: '600' } },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#64748b' },
      },
    },
  };

  // Chart configuration for Model Comparison Bar Chart
  const generateComparisonData = (metric) => {
    const labels = Object.keys(modelsData);
    const data = labels.map((m) => modelsData[m][metric]);

    const palette = {
      accuracy: '#0284c7',
      precision: '#0f766e',
      recall: '#7c3aed',
      f1_score: '#d97706',
    };

    return {
      labels,
      datasets: [
        {
          label: `${metric.toUpperCase().replace('_', ' ')} (%)`,
          data,
          backgroundColor: palette[metric] || '#0284c7',
          borderRadius: 8,
          barThickness: 34,
        },
      ],
    };
  };

  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: '700' },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#334155',
          font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
        },
      },
      y: {
        min: 70,
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#64748b',
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8fafc',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#0284c7',
              fontWeight: 800,
              letterSpacing: '0.1em',
              fontSize: '0.85rem',
            }}
          >
            PERFORMANCE ANALYTICS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#0f172a',
              letterSpacing: '-0.02em',
              mt: 1,
              mb: 2,
            }}
          >
            Interactive Visualizations
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: '1.1rem',
              maxWidth: '680px',
              mx: 'auto',
            }}
          >
            Explore live diagnostic metrics, compare algorithm performance side-by-side, and inspect class-level confusion matrices.
          </Typography>

          {/* Mode Toggle Controls (Vector Icon Buttons, No Pictures) */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <ToggleButtonGroup
              value={visMode}
              exclusive
              onChange={(e, newMode) => newMode && setVisMode(newMode)}
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                p: 0.5,
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              }}
            >
              <ToggleButton
                value="comparison"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '10px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none !important',
                  '&.Mui-selected': {
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#0369a1' },
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 1, fontSize: 20 }} />
                Model Comparison Benchmarks
              </ToggleButton>
              <ToggleButton
                value="confusion"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '10px !important',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none !important',
                  '&.Mui-selected': {
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#0369a1' },
                  },
                }}
              >
                <GridViewIcon sx={{ mr: 1, fontSize: 20 }} />
                Confusion Matrix Grids
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* View 1: Model Comparison */}
        {visMode === 'comparison' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mb: 4,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Cross-Model Metric Benchmark
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Select a performance metric to update the cross-model comparative visualization.
                </Typography>
              </Box>

              {/* Metric Selector Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { id: 'accuracy', label: 'Accuracy' },
                  { id: 'precision', label: 'Precision' },
                  { id: 'recall', label: 'Recall' },
                  { id: 'f1_score', label: 'F1 Score' },
                ].map((m) => (
                  <Button
                    key={m.id}
                    size="small"
                    variant={activeMetric === m.id ? 'contained' : 'outlined'}
                    onClick={() => setActiveMetric(m.id)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      px: 2,
                      py: 0.7,
                      backgroundColor: activeMetric === m.id ? '#0284c7' : 'transparent',
                      borderColor: activeMetric === m.id ? '#0284c7' : '#cbd5e1',
                      color: activeMetric === m.id ? '#ffffff' : '#475569',
                      '&:hover': {
                        backgroundColor: activeMetric === m.id ? '#0369a1' : '#f1f5f9',
                      },
                    }}
                  >
                    {m.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Comparison Bar Chart */}
            <Box sx={{ height: { xs: 320, md: 440 }, position: 'relative' }}>
              <Bar data={generateComparisonData(activeMetric)} options={comparisonOptions} />
            </Box>
          </Paper>
        )}

        {/* View 2: Confusion Matrices for All Models */}
        {visMode === 'confusion' && (
          <Grid container spacing={3.5}>
            {Object.keys(modelsData).map((modelName) => {
              const matrix = modelsData[modelName].confusion_matrix;
              if (!matrix) return null;

              return (
                <Grid item xs={12} md={6} key={modelName}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5,
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 15px rgba(15, 23, 42, 0.03)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                      {modelName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
                      Class 0: Normal Vaginal Birth | Class 1: Cesarean Delivery
                    </Typography>

                    <Box sx={{ height: 240, position: 'relative' }}>
                      <Bar data={generateConfusionData(matrix)} options={confusionOptions} />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
});

export default Visualize;
