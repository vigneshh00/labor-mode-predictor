import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Highlights = React.forwardRef((props, ref) => {
  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: '#0284c7' }} />,
      iconBg: '#e0f2fe',
      title: 'Instant Delivery Triage',
      badge: 'Real-Time',
      description:
        'Rapidly predicts delivery classification within milliseconds. Provides obstetric teams with immediate diagnostic estimates to assist clinical decision-making during labor and delivery monitoring.',
      points: ['Sub-second latency', 'Normal vs C-Section categorization', 'Emergency & planned indication support'],
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 32, color: '#0f766e' }} />,
      iconBg: '#ccfbf1',
      title: 'Multi-Algorithm Consensus',
      badge: '6 ML Architectures',
      description:
        'Cross-verifies predictions across 6 trained classification engines, from tree-based algorithms and linear estimators to multi-layer deep neural networks.',
      points: ['Logistic Regression (99.4%)', 'Keras Deep Neural Network', 'Random Forest & Decision Trees'],
    },
    {
      icon: <CloudUploadIcon sx={{ fontSize: 32, color: '#7c3aed' }} />,
      iconBg: '#ede9fe',
      title: 'Automated CSV Processing',
      badge: 'Batch Inference',
      description:
        'Upload patient records in standard CSV format. The built-in pipeline automatically handles categorical label encoding and standard numerical scaling.',
      points: ['Automatic feature transformation', 'Single or multi-record ingestion', 'Zero manual pre-formatting required'],
    },
    {
      icon: <QueryStatsIcon sx={{ fontSize: 32, color: '#ea580c' }} />,
      iconBg: '#ffedd5',
      title: 'Transparent Model Metrics',
      badge: 'Full Explainability',
      description:
        'Inspect comprehensive diagnostic metrics including confusion matrices, precision, recall, and F1-scores to ensure model reliability across sensitive clinical cases.',
      points: ['Interactive Confusion Matrix graphs', 'Metric comparative benchmarking', 'Class-balanced SMOTE validation'],
    },
  ];

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
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
            CORE CAPABILITIES
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
            Clinical Decision Support Features
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
            Engineered specifically to handle the multifaceted realities of obstetric records and provide trustworthy, actionable clinical insights.
          </Typography>
        </Box>

        {/* Feature Cards Grid (Vector Icons, No Pictures) */}
        <Grid container spacing={3.5}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  borderRadius: '20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 16px 30px rgba(15, 23, 42, 0.06)',
                    borderColor: '#cbd5e1',
                    backgroundColor: '#ffffff',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      backgroundColor: feature.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box
                    sx={{
                      px: 1.8,
                      py: 0.6,
                      borderRadius: '9999px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#475569',
                    }}
                  >
                    {feature.badge}
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    color: '#0f172a',
                    mb: 1.5,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  {feature.description}
                </Typography>

                <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 2.5, mt: 'auto' }}>
                  {feature.points.map((pt, pIdx) => (
                    <Box
                      key={pIdx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        mb: 0.8,
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ fontSize: 17, color: '#10b981' }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        {pt}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default Highlights;
