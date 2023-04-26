import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';
const _baseApi = process.env.REACT_APP_BASE_API;
const _googleApi = process.env.REACT_APP_GOOGLE_API_KEY;


const CreateCustomers = ({ onClose }) => {
  const [formState, setFormState] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    longitude: '',
    latitude: '',
    business_id: 1
  });

  const [errors, setErrors] = useState({
    longitude: '',
    latitude: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleGeocode = async () => {
    const { address, city, state, zipcode } = formState;
    const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;
    
    console.log("Google API", _googleApi)

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: fullAddress,
          key: _googleApi
        }
      });

      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setFormState(prevState => ({
          ...prevState,
          longitude: location.lng,
          latitude: location.lat
        }));
      } else {
        setErrors(prevState => ({
          ...prevState,
          longitude: 'Failed to fetch coordinates',
          latitude: 'Failed to fetch coordinates'
        }));
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      setErrors(prevState => ({
        ...prevState,
        longitude: 'Failed to fetch coordinates',
        latitude: 'Failed to fetch coordinates'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGeocode();
    
    const { longitude, latitude, ...submitData } = formState;
    try {
      const response = await axios.post(`${_baseApi}/users/customer/`, {
        ...submitData,
        longitude: formState.longitude,
        latitude: formState.latitude
      });
      console.log('Customer created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            margin="dense"
            name="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.fullname}
            onChange={handleInputChange}
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
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.city}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.state}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="zipcode"
            label="Zip Code"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.zipcode}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="longitude"
            label="Longitude"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.longitude}
            onChange={handleInputChange}
            error={Boolean(errors.longitude)}
            helperText={errors.longitude}
            disabled
          />
          <TextField
            margin="dense"
            name="latitude"
            label="Latitude"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.latitude}
            onChange={handleInputChange}
            error={Boolean(errors.latitude)}
            helperText={errors.latitude}
            disabled
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

export default CreateCustomers;

