import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import { setTitle } from '@/hooks/setTitle';

const Home = () => {
  setTitle('Home');

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            boxShadow: 3,
          }}
        ></Box>
        <Typography component="h1" variant="h5">
          Home
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
