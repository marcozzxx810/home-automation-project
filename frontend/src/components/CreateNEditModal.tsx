import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal, { ModalProps } from '@mui/material/Modal';
import { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useModal } from 'mui-modal-provider';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createBloodPressureRecord,
  getBloodPressureRecordById,
  updateBloodPressureRecord,
  uploadImageBloodPressureRecord,
} from '@/api/api';
import useSnackbar, { SnackbarProvider } from '@/hooks/useSnackbar';

interface SubmitDialogProps extends DialogProps {
  title: string;
  description: string;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  title,
  description,
  onConfirm,
  ...props
}) => (
  <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} color="primary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

const style: SxProps<Theme> = {
  position: 'absolute',
  width: 800,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 5,
  p: 4,
  color: 'white',
};

export type CreateNEditModalProps = Omit<ModalProps, 'children'> & {
  recordID?: number;
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const CreateNEditModal: React.FC<CreateNEditModalProps> = ({
  recordID,
  onClose,
  ...props
}) => {
  const [recordDateTime, setrecordDateTime] = React.useState<Dayjs | null>(dayjs());

  const [systolicPressure, setSystolicPressure] = React.useState<number>(100);
  const [diastolicPressure, setDiastolicPressure] = React.useState<number>(100);
  const [pulse, setPulse] = React.useState<number>(100);

  const handleChange = (newValue: Dayjs | null) => {
    setrecordDateTime(newValue);
  };

  useEffect(() => {
    console.log(recordID);
    if (recordID) {
      (async () => {
        const res = await getBloodPressureRecordById(recordID);
        if (res.data.length > 0) {
          const {
            systolic_pressure: originalSystolicPressure,
            diastolic_pressure: originalDaistolicPressure,
            pulse: originalPulse,
            created_at: orginalRecordDateTime,
          } = res.data[0];

          setSystolicPressure(originalSystolicPressure);
          setDiastolicPressure(originalDaistolicPressure);
          setPulse(originalPulse);
          setrecordDateTime(dayjs(orginalRecordDateTime));
        }
      })();
    }
  }, [recordID]);

  const { showModal } = useModal();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const res = await uploadImageBloodPressureRecord(file);
    const {
      systolic_pressure: prefilledSystolicPressure,
      diastolic_pressure: prefilledDiastolicPressure,
      pulse: prefilledPulse,
    } = res.data;
    if (prefilledSystolicPressure) setSystolicPressure(prefilledSystolicPressure);
    if (prefilledDiastolicPressure) setDiastolicPressure(prefilledDiastolicPressure);
    if (prefilledPulse) setPulse(prefilledPulse);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (recordDateTime && systolicPressure && diastolicPressure && pulse) {
      if (recordID) {
        const res = await updateBloodPressureRecord(
          recordID,
          recordDateTime,
          systolicPressure,
          diastolicPressure,
          pulse,
        );
        if (res.status === 202) {
          const modal = showModal(SubmitDialog, {
            title: 'Record Alert',
            description: 'Record successfully updated',
            onConfirm: () => {
              modal.hide();
              onClose(event as any);
            },
          });
        } else {
          const modal = showModal(SubmitDialog, {
            title: 'Record Alert',
            description: `Record failed to create, Reason: ${res.data}`,
            onConfirm: () => {
              modal.hide();
            },
          });
        }
      } else {
        const res = await createBloodPressureRecord(
          recordDateTime,
          systolicPressure,
          diastolicPressure,
          pulse,
        );
        if (res.status === 201) {
          const modal = showModal(SubmitDialog, {
            title: 'Record Alert',
            description: 'Record successfully created',
            onConfirm: () => {
              modal.hide();
              onClose(event as any);
            },
          });
        } else {
          const modal = showModal(SubmitDialog, {
            title: 'Record Alert',
            description: `Record failed to create, Reason: ${res.data}`,
            onConfirm: () => {
              modal.hide();
            },
          });
        }
      }
    }
  };

  return (
    <Modal {...props}>
      <SnackbarProvider>
        <Box component="form" onSubmit={submitHandler} sx={style}>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: '5%' }}
          >
            <Grid item>
              <Typography component="h1" variant="h5">
                Blood Pressure
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" component="label">
                Upload
                <input hidden accept="image/*" type="file" onChange={handleFileUpload} />
              </Button>
            </Grid>
          </Grid>
          <DateTimePicker
            sx={{ m: '5%' }}
            label="Record date and time"
            value={recordDateTime}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="systolic_pressure"
            label="Systolic pressure"
            name="systolic_pressure"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={systolicPressure}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => setSystolicPressure(Number(event.target.value))}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="diastolic_pressure"
            label="Diastolic pressure"
            name="diastolic_pressure"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={diastolicPressure}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => setDiastolicPressure(Number(event.target.value))}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="pulse"
            label="Pulse"
            name="pulse"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={pulse}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => setPulse(Number(event.target.value))}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
        </Box>
      </SnackbarProvider>
    </Modal>
  );
};

export default CreateNEditModal;
