import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './styles.css';

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

interface ChildComponentProps {
  handleDelete: () => Promise<void>;
  delUser? : any;
  heading? : any
}

const  BasicModal:React.FC<ChildComponentProps> = ({handleDelete,delUser,heading}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

const handleclose = () => setOpen(false);
  
const onDeleteClick =  () => {
  handleDelete();
  handleclose();
};
  return (
    <div>
      <Button style={{color:'#D83E3E',textTransform: 'none' }} onClick={handleOpen}>Delete </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style}>
            <div>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight:"600"}}>
            Are you sure?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Do you want to delete this {delUser}
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

export default BasicModal;