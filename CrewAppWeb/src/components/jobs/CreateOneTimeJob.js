import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog, FormControlLabel, Checkbox, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { styled } from '@mui/system';
const _baseApi = process.env.REACT_APP_BASE_API;


const StyledInputLabel = styled(InputLabel)({
    backgroundColor: 'white',
    padding: '0 4px',
    marginLeft: '-4px'
  }); 

const CreateOneTimeJob = ({ onClose }) => {
  const [formState, setFormState] = useState({
    customer: '',
    job_location: '',
    crew: '',
    date: '',
    total_man_hours: '',
    instructions_for_crew: '',
    job_ordering: 1,
    mow: false,
    edge: false,
    blow: false
  });

  const [customers, setCustomers] = useState([]);
  const [crews, setCrews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(`${_baseApi}/users/customer/?status=True`);
        const crewsResponse = await axios.get(`${_baseApi}/users/crew`);
        setCustomers(customersResponse.data);
        setCrews(crewsResponse.data);
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
      const response = await axios.post(`${_baseApi}/schedules/jobs/`, formState);
      console.log('Job created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add One Time Job</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl fullWidth margin="dense">
            <StyledInputLabel id="customer-select-label" shrink>Customer</StyledInputLabel>
            <Select
              labelId="customer-select-label"
              id="customer-select"
              name="customer"
              value={formState.customer}
              onChange={handleInputChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Customer' }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {customers.map(customer => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.fullname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="job_location"
            label="Job Location"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.job_location}
            onChange={handleInputChange}
          />
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
              {crews.map(crew => (
                <MenuItem key={crew.id} value={crew.id}>
                  {crew.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formState.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="total_man_hours"
            label="Total Man Hours"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.total_man_hours}
            onChange={handleInputChange}
          />

          <TextField
            margin="dense"
            name="instructions_for_crew"
            label="Instructions for crew"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.instructions_for_crew}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={<Checkbox checked={formState.mow} onChange={handleInputChange} name="mow" />}
            label="Mow"
          />
          <FormControlLabel
            control={<Checkbox checked={formState.edge} onChange={handleInputChange} name="edge" />}
            label="Edge"
          />
          <FormControlLabel
            control={<Checkbox checked={formState.blow} onChange={handleInputChange} name="blow" />}
            label="Blow"
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

export default CreateOneTimeJob;
