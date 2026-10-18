import React from 'react';
import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import BiotechIcon from '@mui/icons-material/Biotech';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';

const About = React.forwardRef(({ refs }, ref) => {
  const scrollTo = (targetRef) => {
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statCards = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 28, color: '#0284c7' }} />,
      value: '99.4%',
      label: 'Peak Accuracy',
      desc: 'Validated across Logistic Regression & Decision Trees',
      bg: '#e0f2fe',
    },
    {
      icon: <BiotechIcon sx={{ fontSize: 28, color: '#0f766e' }} />,
      value: '6 Models',
      label: 'Ensemble & DL Suite',
      desc: 'From Scikit-Learn to Deep Neural Networks',
      bg: '#ccfbf1',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28, color: '#d97706' }} />,
      value: '< 50ms',
      label: 'Instant Evaluation',
      desc: 'Real-time inference for rapid clinical triage',
      bg: '#fef3c7',
    },
    {
      icon: <HealthAndSafetyIcon sx={{ fontSize: 28, color: '#7c3aed' }} />,
      value: '40+ Features',
      label: 'Obstetric Indicators',
      desc: 'Maternal health, labor progression & fetal metrics',
      bg: '#ede9fe',
    },
  ];

  return (
    <Box
      ref={ref}
      sx={{
        pt: { xs: 14, md: 18 },
        pb: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Mission, Rationale & CTAs */}
          <Grid item xs={12} md={7}>
            <Chip
              icon={<HealthAndSafetyIcon sx={{ fontSize: '18px !important', color: '#0284c7' }} />}
              label="Intelligent Obstetric Clinical Support"
              sx={{
                mb: 3,
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 700,
                fontSize: '0.85rem',
                py: 2,
                px: 1,
                border: '1px solid #bae6fd',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.75rem' },
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                mb: 3,
              }}
            >
              Making maternity care <span style={{ color: '#0284c7' }}>safer</span> with predictive AI
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                color: '#475569',
                lineHeight: 1.7,
                mb: 4,
                maxWidth: '600px',
              }}
            >
              Timely identification of cesarean indications reduces emergency surgical complications. 
              MaternaAI processes complex maternal demographics, labor progression parameters, and fetal monitoring data to provide real-time delivery classification.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => scrollTo(refs?.predictRef)}
                sx={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 10px 20px rgba(2, 132, 199, 0.25)',
                  '&:hover': {
                    backgroundColor: '#0369a1',
                  },
                }}
              >
                Launch Prediction
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<AssessmentIcon />}
                onClick={() => scrollTo(refs?.modelRef)}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 3.5,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                View Benchmark Models
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Clean Metric & Feature Cards (No Pictures) */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2.5}>
              {statCards.map((stat, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '18px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 25px rgba(2, 132, 199, 0.1)',
                        borderColor: '#93c5fd',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: stat.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', lineHeight: 1.4, display: 'block' }}
                    >
                      {stat.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default About;
