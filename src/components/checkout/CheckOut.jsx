import { Step, StepLabel, Stepper } from '@mui/material';
import React, { useState } from 'react';

const CheckOut = () => {
  const [activeSteps, setActiveStep] = useState(0);

  const steps = [
    "Enter Location",
    "Payment Methods",
    "Order Summary",
    "Payments",
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}> My Checkout</h2>
      <Stepper activeStep={activeSteps} alternativeLabel style={styles.stepper}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '1rem',
                  color: activeSteps === index ? '#1976d2' : '#999',
                  fontWeight: activeSteps === index ? 'bold' : 'normal',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem',
    maxWidth: '1500px',
    margin: '50px auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: 600,
  },
  stepper: {
    backgroundColor: 'transparent',
  },
};

export default CheckOut;
