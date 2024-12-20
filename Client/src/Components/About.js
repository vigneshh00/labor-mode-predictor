import React from 'react';
import { Box, Typography, Button } from '@mui/material';



const About = React.forwardRef(({ predictRef }, ref) => {

 
  const handleScroll = () => {
    if (predictRef && predictRef.current) {
      predictRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      ref={ref}  
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10%',
        overflow: 'hidden'
      }}
    >
      <Box
        component="img"
        src="/about-pic.png"
        alt="Maternity illustration"
        sx={{
          width: '60%',
          height: '80%',
          mr: 1
        }}
      />

      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '60%',
          mr: 4
        }}
      >
        <Typography variant="body1" color="black" sx={{ fontSize: '3rem', mb: 2 }}>
          Making maternity safer
        </Typography>

        <Box>
          <Typography variant="body1" color="black" sx={{ fontSize: '1.25rem', mb: 2, mt: 4 }}>
            Our application uses advanced machine learning to help predict C-section and natural birth outcomes with accuracy and ease.
          </Typography>
        </Box>

        
      </Box>
    </Box>
  );
});

export default About;
