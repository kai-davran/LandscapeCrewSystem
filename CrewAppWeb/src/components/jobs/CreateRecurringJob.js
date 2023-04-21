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

const CreateRecurringJob = ({ onClose }) => {
  const [formState, setFormState] = useState({
    customer: '',
    crew: '',
    date: '',
    recurring_end_date: '',
    day_of_week: '',
    frequency: '',
    custom_interval_days: 0,
    total_man_hours: '',
    job_ordering: 1,
    instructions_for_crew: '',
    mow: false,
    edge: false,
    blow: false,
    job_type: 2 
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
    const formData = { ...formState };
    
    console.log("Yes suchki, I am working")
    if (formData.frequency !== 'custom') {
        console.log("Yes suchki, I am inside")

        formData.custom_interval_days = 0;
        console.log("Interval inside", formData.custom_interval_days)
      }

    try {
      const response = await axios.post(`${_baseApi}/schedules/jobs/`, formState);
      console.log('Job created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  console.log("Customer", formState.customer)
  console.log("Crew", formState.crew)
  console.log("Start date", formState.date)
  console.log("End date", formState.recurring_end_date)
  console.log("Day of week", formState.day_of_week)
  console.log("Frequency", formState.frequency)
  console.log("Job priority", formState.job_ordering)
  console.log("Interval", formState.custom_interval_days)


  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Recurring Job</DialogTitle>
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
            label="Recurring Job Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formState.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="recurring_end_date"
            label="Recurring Job End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formState.recurring_end_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <StyledInputLabel id="day-of-week-select-label" shrink>Day of Week</StyledInputLabel>
            <Select
              labelId="day-of-week-select-label"
              id="day-of-week-select"
              name="day_of_week"
              value={formState.day_of_week}
              onChange={handleInputChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Day of Week' }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <StyledInputLabel id="frequency-select-label" shrink>Frequency</StyledInputLabel>
            <Select
              labelId="frequency-select-label"
              id="frequency-select"
              name="frequency"
              value={formState.frequency}
              onChange={handleInputChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Frequency' }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {['weekly', 'biweekly', 'triweekly', 'quadweekly', 'custom'].map(freq => (
                <MenuItem key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formState.frequency === 'custom' && (
            <TextField
              margin="dense"
              name="custom_interval_days"
              label="Custom Interval Days"
              type="number"
              fullWidth
              variant="outlined"
              value={formState.custom_interval_days}
              onChange={handleInputChange}
            />
          )}
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

export default CreateRecurringJob;
