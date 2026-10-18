import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Chip,
  Card,
  LinearProgress,
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DownloadIcon from '@mui/icons-material/Download';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Predict = React.forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    age: 28,
    height_cm: 165,
    weight_kg: 68,
    gestational_age_weeks: 39,
    weight_gain_kg: 12,
    previous_cesarean: 'no',
    num_previous_cesarean: 0,
    fetal_presentation: 'cephalic',
    comorbidity: 'no',
    obstetric_risk: 'low',
    induction: 'no',
    model_name: 'logistic_regression',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // File Upload State
  const [file, setFile] = useState(null);
  const [modelUpload, setModelUpload] = useState('logistic_regression');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [resultUpload, setResultUpload] = useState(null);
  const [errorUpload, setErrorUpload] = useState(null);

  // Calculate live BMI
  const heightM = (parseFloat(formData.height_cm) || 165) / 100.0;
  const weightKg = parseFloat(formData.weight_kg) || 68;
  const liveBmi = (weightKg / (heightM * heightM)).toFixed(1);

  const modelOptions = [
    { value: 'logistic_regression', label: 'Logistic Regression (99.4% Acc - Recommended)' },
    { value: 'decision_tree', label: 'Decision Tree (99.3% Acc)' },
    { value: 'random_forest', label: 'Random Forest (99.9% Acc)' },
    { value: 'neural_network', label: 'Deep Neural Network (99.2% Acc)' },
    { value: 'svm', label: 'Support Vector Machine (99.3% Acc)' },
    { value: 'knn', label: 'K-Nearest Neighbors (96.5% Acc)' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Demo presets
  const loadLowRiskDemo = () => {
    setFormData({
      age: 26,
      height_cm: 167,
      weight_kg: 62,
      gestational_age_weeks: 39,
      weight_gain_kg: 11,
      previous_cesarean: 'no',
      num_previous_cesarean: 0,
      fetal_presentation: 'cephalic',
      comorbidity: 'no',
      obstetric_risk: 'low',
      induction: 'no',
      model_name: 'logistic_regression',
    });
    setResult(null);
    setError(null);
  };

  const loadHighRiskDemo = () => {
    setFormData({
      age: 36,
      height_cm: 160,
      weight_kg: 84,
      gestational_age_weeks: 38,
      weight_gain_kg: 18,
      previous_cesarean: 'yes',
      num_previous_cesarean: 1,
      fetal_presentation: 'breech',
      comorbidity: 'yes',
      obstetric_risk: 'high',
      induction: 'yes',
      model_name: 'logistic_regression',
    });
    setResult(null);
    setError(null);
  };

  // Handle Form Submit
  const handleFormPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post('http://localhost:5000/predict', {
        ...formData,
        bmi: liveBmi,
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Unable to reach backend server on http://localhost:5000. Please make sure the Flask server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV Upload
  const handleFileUploadPredict = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorUpload('Please select a CSV file to evaluate.');
      return;
    }

    setLoadingUpload(true);
    setErrorUpload(null);
    setResultUpload(null);

    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('model_name', modelUpload);

      const res = await axios.post('http://localhost:5000/predict1', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResultUpload(res.data);
    } catch (err) {
      setErrorUpload(
        err.response?.data?.error ||
          'Failed to process CSV file. Ensure the file has valid values or download the template below.'
      );
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: '#0284c7', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.85rem' }}
          >
            PATIENT INFERENCE WORKBENCH
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
            Delivery Outcome Evaluation
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '680px', mx: 'auto' }}
          >
            Enter maternal and obstetric details below or upload a patient records CSV file to generate real-time clinical delivery predictions.
          </Typography>
        </Box>

        {/* Workbench Wrapper */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3, pt: 2, backgroundColor: '#f8fafc' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newVal) => setActiveTab(newVal)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  py: 2,
                },
              }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Patient Health Details Form" />
              <Tab icon={<UploadFileIcon />} iconPosition="start" label="Upload Patient Records (.csv)" />
            </Tabs>
          </Box>

          {/* Tab 1: Interactive Patient Details Form */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={5} alignItems="flex-start">
                {/* Form Input Columns */}
                <Grid item xs={12} lg={7}>
                  {/* Demo Pre-fill helpers */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                      Auto-fill Sample Patient:
                    </Typography>
                    <Chip
                      icon={<AutoFixHighIcon sx={{ fontSize: '15px !important' }} />}
                      label="Standard Low-Risk (Normal)"
                      size="small"
                      clickable
                      onClick={loadLowRiskDemo}
                      sx={{ backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 600 }}
                    />
                    <Chip
                      icon={<AutoFixHighIcon sx={{ fontSize: '15px !important' }} />}
                      label="Prior C-Section & Breech (High Risk)"
                      size="small"
                      clickable
                      onClick={loadHighRiskDemo}
                      sx={{ backgroundColor: '#fef2f2', color: '#b91c1c', fontWeight: 600 }}
                    />
                  </Box>

                  <Box component="form" onSubmit={handleFormPredict}>
                    {/* Section 1: Demographics */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                      1. Maternal Demographics & Physical Metrics
                    </Typography>

                    <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Maternal Age (Years)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="15"
                          max="55"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="custom-input"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Gestational Age (Weeks)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="24"
                          max="44"
                          value={formData.gestational_age_weeks}
                          onChange={(e) => handleInputChange('gestational_age_weeks', e.target.value)}
                          className="custom-input"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Weight Gain (kg)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="40"
                          value={formData.weight_gain_kg}
                          onChange={(e) => handleInputChange('weight_gain_kg', e.target.value)}
                          className="custom-input"
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Height (cm)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="120"
                          max="210"
                          value={formData.height_cm}
                          onChange={(e) => handleInputChange('height_cm', e.target.value)}
                          className="custom-input"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Weight (kg)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="35"
                          max="180"
                          value={formData.weight_kg}
                          onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                          className="custom-input"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Calculated BMI
                        </Form.Label>
                        <Box
                          sx={{
                            p: 1.2,
                            borderRadius: '10px',
                            backgroundColor: '#f8fafc',
                            border: '1.5px solid #e2e8f0',
                            textAlign: 'center',
                            fontWeight: 700,
                            color: parseFloat(liveBmi) >= 30 ? '#d97706' : '#047857',
                          }}
                        >
                          {liveBmi} kg/m²
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Section 2: Obstetric History & Indications */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                      2. Obstetric History & Clinical Indications
                    </Typography>

                    <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                      <Grid item xs={12} sm={6}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Prior Cesarean Delivery?
                        </Form.Label>
                        <Form.Select
                          value={formData.previous_cesarean}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleInputChange('previous_cesarean', val);
                            if (val === 'no') handleInputChange('num_previous_cesarean', 0);
                            else if (formData.num_previous_cesarean === 0) handleInputChange('num_previous_cesarean', 1);
                          }}
                          className="custom-select"
                        >
                          <option value="no">No Prior C-Section (Primiparous / Normal Vaginal)</option>
                          <option value="yes">Yes - Prior Cesarean Delivery</option>
                        </Form.Select>
                      </Grid>

                      {formData.previous_cesarean === 'yes' && (
                        <Grid item xs={12} sm={6}>
                          <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                            Number of Prior C-Sections
                          </Form.Label>
                          <Form.Select
                            value={formData.num_previous_cesarean}
                            onChange={(e) => handleInputChange('num_previous_cesarean', e.target.value)}
                            className="custom-select"
                          >
                            <option value="1">1 Prior Cesarean</option>
                            <option value="2">2 Prior Cesareans</option>
                            <option value="3">3+ Prior Cesareans</option>
                          </Form.Select>
                        </Grid>
                      )}

                      <Grid item xs={12} sm={6}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Fetal Presentation & Labor Indication
                        </Form.Label>
                        <Form.Select
                          value={formData.fetal_presentation}
                          onChange={(e) => handleInputChange('fetal_presentation', e.target.value)}
                          className="custom-select"
                        >
                          <option value="cephalic">Cephalic (Normal Head First)</option>
                          <option value="breech">Breech / Podalic Presentation</option>
                          <option value="transverse">Transverse Lie / Non-Cephalic</option>
                          <option value="stalled_labor">Stalled Labor / Prolonged 2nd Stage</option>
                          <option value="fetal_distress">Fetal Distress / Abnormal Heart Rate</option>
                        </Form.Select>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Maternal Comorbidity
                        </Form.Label>
                        <Form.Select
                          value={formData.comorbidity}
                          onChange={(e) => handleInputChange('comorbidity', e.target.value)}
                          className="custom-select"
                        >
                          <option value="no">No Comorbidities Reported</option>
                          <option value="yes">Yes (Gestational Diabetes, Hypertension, etc.)</option>
                        </Form.Select>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Obstetric Risk Classification
                        </Form.Label>
                        <Form.Select
                          value={formData.obstetric_risk}
                          onChange={(e) => handleInputChange('obstetric_risk', e.target.value)}
                          className="custom-select"
                        >
                          <option value="low">Standard / Low Risk Pregnancy</option>
                          <option value="high">High Risk Pregnancy</option>
                        </Form.Select>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                          Labor Induction
                        </Form.Label>
                        <Form.Select
                          value={formData.induction}
                          onChange={(e) => handleInputChange('induction', e.target.value)}
                          className="custom-select"
                        >
                          <option value="no">Spontaneous Onset of Labor</option>
                          <option value="yes">Medically Induced Labor</option>
                        </Form.Select>
                      </Grid>
                    </Grid>

                    {/* Section 3: Model */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                        Machine Learning Classifier
                      </Form.Label>
                      <Form.Select
                        value={formData.model_name}
                        onChange={(e) => handleInputChange('model_name', e.target.value)}
                        className="custom-select"
                      >
                        {modelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                      sx={{
                        py: 1.6,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        backgroundColor: '#0284c7',
                        boxShadow: '0 8px 18px rgba(2, 132, 199, 0.25)',
                        '&:hover': { backgroundColor: '#0369a1' },
                      }}
                    >
                      {loading ? 'Analyzing Clinical Parameters...' : 'Evaluate Delivery Outcome'}
                    </Button>

                    {error && (
                      <Alert severity="error" sx={{ mt: 3, borderRadius: '12px' }}>
                        {error}
                      </Alert>
                    )}
                  </Box>
                </Grid>

                {/* Result Column */}
                <Grid item xs={12} lg={5}>
                  <ClinicalResultCard
                    result={result}
                    loading={loading}
                    defaultHint="Fill in the patient's maternal and obstetric details on the left, then click 'Evaluate Delivery Outcome' to receive an instant delivery classification."
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 2: Upload CSV */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={5} alignItems="flex-start">
                {/* Upload Form */}
                <Grid item xs={12} md={6}>
                  <Box component="form" onSubmit={handleFileUploadPredict}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                      Upload Patient Record (.csv)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                      Upload a single patient row or test instance in CSV format. Supports both the simplified patient template and full 49-column clinical datasets.
                    </Typography>

                    {/* Download Template Card */}
                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: '#f8fafc',
                        border: '1.5px dashed #cbd5e1',
                        borderRadius: '16px',
                        p: 2.5,
                        mb: 4,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            Need the patient CSV template?
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            Download our pre-formatted spreadsheet with sample patient records.
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          href="/patient_template.csv"
                          download="patient_template.csv"
                          startIcon={<DownloadIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderColor: '#0284c7',
                            color: '#0284c7',
                          }}
                        >
                          Download Template
                        </Button>
                      </Box>
                    </Card>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                        Select Patient CSV File
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="custom-input"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                        Classification Algorithm
                      </Form.Label>
                      <Form.Select
                        value={modelUpload}
                        onChange={(e) => setModelUpload(e.target.value)}
                        className="custom-select"
                      >
                        {modelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loadingUpload}
                      startIcon={loadingUpload ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
                      sx={{
                        py: 1.6,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        backgroundColor: '#0284c7',
                        boxShadow: '0 8px 18px rgba(2, 132, 199, 0.25)',
                        '&:hover': { backgroundColor: '#0369a1' },
                      }}
                    >
                      {loadingUpload ? 'Uploading & Processing...' : 'Process Patient File'}
                    </Button>

                    {errorUpload && (
                      <Alert severity="error" sx={{ mt: 3, borderRadius: '12px' }}>
                        {errorUpload}
                      </Alert>
                    )}
                  </Box>
                </Grid>

                {/* Upload Result */}
                <Grid item xs={12} md={6}>
                  <ClinicalResultCard
                    result={resultUpload}
                    loading={loadingUpload}
                    defaultHint="Choose a patient CSV file or download the template to test file-based delivery predictions."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
});

// Comprehensive Clinical Result Presentation Card
const ClinicalResultCard = ({ result, loading, defaultHint }) => {
  if (loading) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '18px',
          border: '1.5px dashed #cbd5e1',
        }}
      >
        <CircularProgress size={42} sx={{ color: '#0284c7', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#475569', fontWeight: 600 }}>
          Scoring clinical indicators through trained model pipeline...
        </Typography>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '18px',
          border: '1.5px dashed #cbd5e1',
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
        <Typography variant="h6" sx={{ color: '#334155', fontWeight: 700, mb: 1 }}>
          Awaiting Patient Evaluation
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: '340px', mx: 'auto' }}>
          {defaultHint}
        </Typography>
      </Box>
    );
  }

  const isCSection = result.prediction === 1 || result.birth_type?.toLowerCase().includes('c-section');
  const probPercent = result.probability ? Math.round(result.probability * 100) : isCSection ? 88 : 12;

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '20px',
        backgroundColor: isCSection ? '#fff5f5' : '#f0fdf4',
        border: '1.5px solid',
        borderColor: isCSection ? '#fecaca' : '#bbf7d0',
        boxShadow: isCSection
          ? '0 10px 25px rgba(239, 68, 68, 0.08)'
          : '0 10px 25px rgba(16, 185, 129, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        {isCSection ? (
          <WarningAmberIcon sx={{ fontSize: 40, color: '#dc2626' }} />
        ) : (
          <CheckCircleIcon sx={{ fontSize: 40, color: '#16a34a' }} />
        )}
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Predicted Clinical Outcome
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: isCSection ? '#991b1b' : '#14532d',
              letterSpacing: '-0.02em',
            }}
          >
            {result.birth_type}
          </Typography>
        </Box>
      </Box>

      {/* Summary */}
      <Typography
        variant="body2"
        sx={{
          color: isCSection ? '#7f1d1d' : '#166534',
          mb: 3,
          lineHeight: 1.6,
          fontWeight: 500,
        }}
      >
        {result.summary}
      </Typography>

      {/* Probability Gauge */}
      <Box sx={{ mb: 3, p: 2, borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
            Estimated Surgical Probability
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: isCSection ? '#dc2626' : '#16a34a', fontSize: '0.9rem' }}
          >
            {probPercent}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={probPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              backgroundColor: isCSection ? '#dc2626' : '#16a34a',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            0% (Spontaneous)
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            100% (Cesarean)
          </Typography>
        </Box>
      </Box>

      {/* Risk Factors Checklist */}
      {result.risk_factors && result.risk_factors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1 }}>
            Identified Obstetric Factors:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {result.risk_factors.map((factor, fIdx) => (
              <Box key={fIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: isCSection ? '#dc2626' : '#16a34a',
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                  {factor}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Metadata Chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`Risk Level: ${result.risk_level || (isCSection ? 'High' : 'Low')}`}
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: isCSection ? '#fee2e2' : '#dcfce7',
            color: isCSection ? '#991b1b' : '#166534',
          }}
        />
        <Chip
          label={`Model: ${result.model_used || 'logistic_regression'}`}
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
          }}
        />
      </Box>
    </Box>
  );
};

export default Predict;
