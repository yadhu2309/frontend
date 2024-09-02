import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

export default function PositionedSnackbar() {
  

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <React.Fragment>
      
      <Grid container sx={{ justifyContent: 'center' }}>
       
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button onClick={handleClick()}>
            Top-Right
          </Button>
        </Grid>
        
      </Grid>
     
    </React.Fragment>
  );

  return (
    <Box sx={{ width: 500 }}>
      {buttons}
      
    </Box>
  );
}
