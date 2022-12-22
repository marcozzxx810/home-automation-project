import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { setTitle } from '@/hooks/setTitle';
import useAuth from '@/hooks/useAuth';

const Login = () => {
  setTitle('Home');

  const { setUser, setInitialLoading } = useAuth();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const signInHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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
            boxShadow: 5,
          }}
        >
          <Avatar sx={{ m: 5, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <Box component="form" onSubmit={signInHandler} noValidate sx={{ m: 5 }}>
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
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
