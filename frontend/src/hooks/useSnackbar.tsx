import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface SnackbarContextType {
  showMessage: ({
    message,
    severity,
    duration,
  }: {
    message: string;
    severity?: AlertColor;
    duration?: number;
  }) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({} as SnackbarContextType);

export const SnackbarProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>();
  const [duration, setDuration] = useState(2000);

  const handleClose = () => {
    setOpen(false);
  };

  const showMessage = ({
    message,
    severity = 'success',
    duration = 2000,
  }: {
    message: string;
    severity?: AlertColor;
    duration?: number;
  }) => {
    setMessage(message);
    setSeverity(severity);
    setDuration(duration);
    setOpen(true);
  };

  const memoedValue = useMemo(
    () => ({
      showMessage,
    }),
    [],
  );

  return (
    <SnackbarContext.Provider value={memoedValue}>
      {children}
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default function useSnackbar() {
  return useContext(SnackbarContext);
}
