import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';

const _baseApi = process.env.REACT_APP_BASE_API;

const CreateCrews = ({ onClose }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    business_id: 1
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePasswords = () => {
    const newErrors = { password: '', confirmPassword: '' };
    if (formState.password !== formState.confirmPassword) {
      newErrors.password = 'Passwords do not match';
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    const { confirmPassword, ...submitData } = formState; // Exclude confirmPassword from the data sent to the backend
    try {
      const response = await axios.post(`${_baseApi}/users/crew/`, submitData);
      console.log('Crew created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating crew:', error);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Crew</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            margin="dense"
            name="name"
            label="Crew Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.name}
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
            label="Crew Address"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formState.password}
            onChange={handleInputChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formState.confirmPassword}
            onChange={handleInputChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
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

export default CreateCrews;
