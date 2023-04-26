import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { styled } from '@mui/system';
const _baseApi = process.env.REACT_APP_BASE_API;


const StyledInputLabel = styled(InputLabel)({
    backgroundColor: 'white',
    padding: '0 4px',
    marginLeft: '-4px'
  }); 

const CreateCrewMembers = ({ onClose }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    crew: ''
  });

  const [crew, setCrew] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const crewResponse = await axios.get(`${_baseApi}/users/crew/`);
        setCrew(crewResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${_baseApi}/users/crewmember/`, formState);
      console.log('Crew member Created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating crew member:', error);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Crew Member</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >

          <FormControl fullWidth margin="dense">
            <StyledInputLabel id="crew-select-label" shrink>Crew</StyledInputLabel>
            <Select
              labelId="crew-select-label"
              id="crew-select"
              name="crew"
              value={formState.crew}
              onChange={handleInputChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Crew' }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {crew.map(crew => (
                <MenuItem key={crew.id} value={crew.id}>
                  {crew.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="name"
            label="name"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.name}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formState.email}
            onChange={handleInputChange}
          />

          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.phone}
            onChange={handleInputChange}
          />

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button type="submit" onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCrewMembers;
