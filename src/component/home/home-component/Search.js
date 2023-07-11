import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function Search({classNames}) {
  return (
          <TextField className={classNames}
            label="Search Your Website"
            InputProps={{
              type: 'search',
            }}
          />
  );
}
