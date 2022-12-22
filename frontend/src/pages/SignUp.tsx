import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { setTitle } from '@/hooks/setTitle';

const SignUp = () => {
  setTitle('SignUp');

  const signUpHandler = () => {
    if (email && password && confirmPassword) {
      console.log(email, password);
    }
  };
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setconfirmPassword] = useState<string>();
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
        >
          <Avatar sx={{ m: 5, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Box component="form" onSubmit={signUpHandler} noValidate sx={{ m: 5 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm password"
              label="Confirm password"
              type="password"
              id="confirm password"
              autoComplete="confirm password"
              onChange={(event) => setconfirmPassword(event.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
