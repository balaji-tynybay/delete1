import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
interface ChildComponentProps {
  applicationList?: any
  
}
const DropDown:React.FC<ChildComponentProps> =  ({applicationList}) =>{
  const [age, setAge] = React.useState('');
  

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 250,marginRight:"20px"}}>
      <FormControl size='small' fullWidth>
        <InputLabel id="demo-simple-select-label">Application</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Application"
          onChange={handleChange}
        >
           {applicationList.map((app: any) => (
            <MenuItem key={app.id} value={app}>
              {app}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
export default DropDown