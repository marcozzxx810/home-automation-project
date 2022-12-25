import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
export const columnsDict = {
  test: [
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
              onClick={() =>
                console.log(tableMeta['tableData'][tableMeta['rowIndex']].id)
              }
              variant="outlined"
            >
              <EditIcon />
            </Button>
          );
        },
      },
    },
  ],
};
