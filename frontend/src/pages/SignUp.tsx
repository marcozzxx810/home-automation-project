import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { register } from '@/api/api';
import { setTitle } from '@/hooks/setTitle';
import useSnackbar from '@/hooks/useSnackbar';

const SignUp = () => {
  setTitle('SignUp');

  const { showMessage } = useSnackbar();

  const signUpHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username && email && password && confirmPassword && isStaff && passcode) {
      console.log(username, email, password, confirmPassword, isStaff, passcode);

      if (password != confirmPassword) {
        showMessage({
          message: `Password and confirm passowrd not match`,
          severity: 'error',
        });

        return;
      }

      const res = await register(email, username, passcode, isStaff, passcode);
      console.log('hi');
      if (res.status === 200) {
        showMessage({ message: `${username} successfully created`, severity: 'success' });
      } else {
        showMessage({
          message: `failed to create ${username}, Reason: ${res.data}`,
          severity: 'error',
        });
      }
    }
  };

  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setconfirmPassword] = useState<string>();
  const [isStaff, setIsStaff] = useState<boolean>();
  const [passcode, setPasscode] = useState<string>();
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
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={(event) => setUsername(event.target.value)}
            />
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
            <FormLabel id="role-radio-button-group-label">Role</FormLabel>
            <RadioGroup
              row
              aria-labelledby="role-radio-button-group-label"
              name="role-radio-buttons-group"
              value={isStaff ? 'staff' : 'user'}
              onChange={(event) =>
                setIsStaff(
                  (event.target as HTMLInputElement).value === 'staff' ? true : false,
                )
              }
            >
              <FormControlLabel value="staff" control={<Radio />} label="Staff" />
              <FormControlLabel value="user" control={<Radio />} label="User" />
            </RadioGroup>
            <TextField
              margin="normal"
              required
              fullWidth
              name="passcode"
              label="Passcode"
              type="passcode"
              id="passcode"
              autoComplete="passcode"
              onChange={(event) => setPasscode(event.target.value)}
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
