import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import MuiStepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';

import { Iconify } from 'src/components/iconify';


export function Stepper({ steps, activeStep }) {
  return (
    <MuiStepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel
            slots={{
              stepIcon: ({ active, completed }) => (
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    color: 'text.disabled',
                    typography: 'subtitle2',
                    justifyContent: 'center',
                    bgcolor: 'action.disabledBackground',
                    ...(active && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                    ...(completed && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                  }}
                >
                  {completed ? (
                    <Iconify width={14} icon="mingcute:check-fill" />
                  ) : (
                    <Box sx={{ typography: 'subtitle2' }}>{index + 1}</Box>
                  )}
                </Box>
              ),
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}
