import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Container,
  Dialog,
  DialogProps,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useModal } from 'mui-modal-provider';
import React, { useEffect, useState } from 'react';

import { deleteBloodPressureRecord, getBloodPressureRecord } from '@/api/api';
import CreateNEditModal from '@/components/CreateNEditModal';
import { columnsDict } from '@/constants/MUIColumnsOptions';
import { setTitle } from '@/hooks/setTitle';

const Home = () => {
  setTitle('Home');

  const [data, setData] = useState<any>([]);
  const { showModal } = useModal();

  const updateData = async () => {
    const res = await getBloodPressureRecord();

    setData(res.data);
  };

  useEffect(() => {
    (async () => {
      await updateData();
    })();
  }, []);

  const columnsOptions = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'systolic_pressure',
      label: 'Systolic Pressure',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'diastolic_pressure',
      label: 'Diastolic Pressure',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'pulse',
      label: 'Pulse',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'created_at',
      label: 'Recored At',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'updated_at',
      label: 'Updated At',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'Edit',
      options: {
        filter: false,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <Button
              onClick={() => {
                const modal_edit = showModal(CreateNEditModal, {
                  recordID: tableMeta['tableData'][tableMeta['rowIndex']].id,
                  onClose: () => {
                    modal_edit.hide();
                    updateData();
                  },
                });
              }}
              variant="outlined"
            >
              <EditIcon />
            </Button>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    filterType: 'checkbox',
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map((d) => data[d.dataIndex].id); // array of all ids to to be deleted
      (async () => {
        const unresolvedPromises = idsToDelete.map((id) => deleteBloodPressureRecord(id));
        const results = await Promise.all(unresolvedPromises);
      })();
    },
    enableNestedDataAccess: '.',
  };

  return (
    <Box sx={{ margin: '3em' }}>
      <Box m={5}>
        <MUIDataTable
          title={
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Typography component="h1" variant="h5">
                  Blood Pressure
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => {
                    const modal_create = showModal(CreateNEditModal, {
                      onClose: () => {
                        modal_create.hide();
                        updateData();
                      },
                    });
                  }}
                  aria-label="create-blood-pressure"
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          }
          data={data}
          columns={columnsOptions}
          options={options}
        />
      </Box>
    </Box>
  );
};

export default Home;
