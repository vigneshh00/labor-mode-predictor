import React from 'react';
import { Button, Typography } from '@mui/material';


const CustomButton = ({ children }) => (
<Button sx={{ 
    mb: 2, 
    mt: 4, 
    backgroundColor: '#301934', 
    '&:hover': {
      backgroundColor: '#4e1b3c', 
    }
  }}>
    <Typography sx={{ 
      color: '#ffe6e6' 
    }}>
      {children}
    </Typography>
  </Button>
);

export default CustomButton;
