import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const Navbar = ({ refs }) => {
  const [activeSection, setActiveSection] = useState('About');
  const [scrolled, setScrolled] = useState(false);

  const handleScrollTo = (ref, section) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        { ref: refs.aboutRef, name: 'About' },
        { ref: refs.highlightRef, name: 'Highlights' },
        { ref: refs.modelRef, name: 'Models' },
        { ref: refs.predictRef, name: 'Predict' },
        { ref: refs.visRef, name: 'Visualize' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        if (item.ref && item.ref.current) {
          const rect = item.ref.current.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(item.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [refs]);

  const navLinks = [
    { text: 'About', ref: refs.aboutRef },
    { text: 'Highlights', ref: refs.highlightRef },
    { text: 'Models', ref: refs.modelRef },
    { text: 'Predict', ref: refs.predictRef },
    { text: 'Visualize', ref: refs.visRef },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 2 : 0}
      sx={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
          {/* Brand Logo & Title (Vector SVG Icon, No Images) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onClick={() => handleScrollTo(refs.aboutRef, 'About')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                mr: 1.5,
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.02em',
                  color: '#0f172a',
                  lineHeight: 1.1,
                }}
              >
                Materna<span style={{ color: '#0284c7' }}>AI</span>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Delivery Mode Assessment
              </Typography>
            </Box>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.text;
              return (
                <Button
                  key={link.text}
                  onClick={() => handleScrollTo(link.ref, link.text)}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0284c7' : '#475569',
                    backgroundColor: isActive ? '#e0f2fe' : 'transparent',
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#e0f2fe' : '#f1f5f9',
                      color: '#0284c7',
                    },
                  }}
                >
                  {link.text}
                </Button>
              );
            })}

            {/* Quick Action Button */}
            <Button
              variant="contained"
              startIcon={<AutoGraphIcon />}
              onClick={() => handleScrollTo(refs.predictRef, 'Predict')}
              sx={{
                ml: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: '#0284c7',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                '&:hover': {
                  backgroundColor: '#0369a1',
                },
              }}
            >
              Run Diagnostic
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
