import React from 'react';
import { Stack, styled } from '@mui/material';

const MobileStepper = ({ activeStep, steps, onStepClick }) => (
  <StepsContainer>
    {Array.from(Array(steps).keys()).map(step => (
      <Step key={step} onClick={() => onStepClick(step)} active={activeStep === step} />
    ))}
  </StepsContainer>
);

export default MobileStepper;

const StepsContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: 'transparent',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  flexDirection: 'row',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
}));

const Step = styled('button')(({ theme, active }) => ({
  height: '8px',
  width: '8px',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[400],
  cursor: 'pointer',
}));