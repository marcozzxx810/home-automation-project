import {
  Box,
  Container,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ModalProvider from 'mui-modal-provider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/hooks/useAuth';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { Router } from '@/router';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
          },
          secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
          },
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ModalProvider>
          <SnackbarProvider>
            <BrowserRouter>
              <AuthProvider>
                <Paper sx={{ height: '100', width: '100vw', minHeight: '100vh' }}>
                  <Navbar />
                  <Router />
                </Paper>
              </AuthProvider>
            </BrowserRouter>
          </SnackbarProvider>
        </ModalProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
