import React, { useEffect, useState } from 'react';
import modelsData from '../results.json';
import { Box, Typography, Container, Grid, LinearProgress, Chip } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import HubIcon from '@mui/icons-material/Hub';
import ForestIcon from '@mui/icons-material/Forest';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Model = React.forwardRef((props, ref) => {
  const [models, setModelsData] = useState([]);

  const getModelIcon = (name) => {
    switch (name) {
      case 'Logistic Regression':
        return <LinearScaleIcon sx={{ color: '#0284c7' }} />;
      case 'Decision Tree':
        return <AccountTreeIcon sx={{ color: '#0f766e' }} />;
      case 'Random Forest':
        return <ForestIcon sx={{ color: '#16a34a' }} />;
      case 'Neural Network':
        return <HubIcon sx={{ color: '#7c3aed' }} />;
      case 'K Nearest Neighbours':
        return <ScatterPlotIcon sx={{ color: '#ea580c' }} />;
      case 'Support Vector Machine':
        return <PsychologyIcon sx={{ color: '#dc2626' }} />;
      default:
        return <PsychologyIcon sx={{ color: '#0284c7' }} />;
    }
  };

  const getModelCategory = (name) => {
    switch (name) {
      case 'Logistic Regression':
        return 'Generalized Linear Model';
      case 'Decision Tree':
        return 'Rule-based Classifier';
      case 'Random Forest':
        return 'Ensemble Learning';
      case 'Neural Network':
        return 'Deep MLP / Keras';
      case 'K Nearest Neighbours':
        return 'Instance-based Classifier';
      case 'Support Vector Machine':
        return 'Max-Margin Hyperplane';
      default:
        return 'Classification Model';
    }
  };

  useEffect(() => {
    const formatted = Object.entries(modelsData).map(([name, metrics]) => {
      const isTop = metrics.accuracy >= 99.3;
      return {
        name,
        category: getModelCategory(name),
        icon: getModelIcon(name),
        isTop,
        metrics: {
          accuracy: metrics.accuracy,
          precision: metrics.precision,
          recall: metrics.recall,
          f1_score: metrics.f1_score,
        },
        description:
          name === 'K Nearest Neighbours'
            ? 'Classifies cases based on feature proximity in n-dimensional patient parameter space.'
            : name === 'Decision Tree'
            ? 'Hierarchical decision rules modeling explicit clinical indicators and thresholds.'
            : name === 'Logistic Regression'
            ? 'Probability calibration with strong interpretability for binary obstetric triage.'
            : name === 'Neural Network'
            ? 'Multi-layer feedforward architecture capturing non-linear feature interactions.'
            : name === 'Random Forest'
            ? 'Ensemble of bagging trees aggregating majority voting for robust variance reduction.'
            : 'Finds optimal margin hyperplanes separating normal from operative indications.',
      };
    });

    setModelsData(formatted);
  }, []);

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
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#0284c7',
              fontWeight: 800,
              letterSpacing: '0.1em',
              fontSize: '0.85rem',
            }}
          >
            BENCHMARKED ARCHITECTURES
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
            Machine Learning Model Suite
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
            Each algorithm was trained and validated on preprocessed obstetric records with SMOTE class balancing. Review the exact performance metrics below.
          </Typography>
        </Box>

        {/* 6 Models Grid */}
        <Grid container spacing={3.5}>
          {models.map((model, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid',
                  borderColor: model.isTop ? '#bae6fd' : '#e2e8f0',
                  boxShadow: model.isTop
                    ? '0 10px 25px rgba(2, 132, 199, 0.08)'
                    : '0 4px 15px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 18px 30px rgba(15, 23, 42, 0.08)',
                    borderColor: '#93c5fd',
                  },
                }}
              >
                {/* Top Performer Badge */}
                {model.isTop && (
                  <Chip
                    icon={<EmojiEventsIcon sx={{ fontSize: '15px !important', color: '#0369a1' }} />}
                    label="Top Performer"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  />
                )}

                {/* Model Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {model.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', lineHeight: 1.2 }}
                    >
                      {model.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {model.category}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, mb: 3 }}
                >
                  {model.description}
                </Typography>

                {/* Metrics Breakdown */}
                <Box sx={{ mt: 'auto' }}>
                  <MetricRow label="Accuracy" value={model.metrics.accuracy} />
                  <MetricRow label="Precision" value={model.metrics.precision} />
                  <MetricRow label="Recall" value={model.metrics.recall} />
                  <MetricRow label="F1 Score" value={model.metrics.f1_score} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

// Helper component for metric bar
const MetricRow = ({ label, value }) => {
  const formattedVal = typeof value === 'number' ? value.toFixed(2) : value;
  const numVal = typeof value === 'number' ? Math.min(value, 100) : 0;

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 800, fontSize: '0.8rem' }}>
          {formattedVal}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={numVal}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: '#f1f5f9',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: numVal >= 99 ? '#10b981' : numVal >= 90 ? '#0284c7' : '#f59e0b',
          },
        }}
      />
    </Box>
  );
};

export default Model;
