import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 220,
  bgcolor: 'background.paper',
//   border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  
};



const  SuccessModal:React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

const handleclose = () => setOpen(false);
  
const onDeleteClick =  () => {
  
  handleclose();
};
  return (
    <div>
      <Button style={{color:'black',textTransform: 'none' }} onClick={handleOpen}>Submit</Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style}>
            <div>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight:"600"}}>
            customer 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           created Successfully
          </Typography></div>
          <div className='yes-no-container' >
            <button className='no-button' onClick={handleclose}>
                NO
            </button>
            <button className='yes-button'   onClick={onDeleteClick}>
                YES
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default SuccessModal;