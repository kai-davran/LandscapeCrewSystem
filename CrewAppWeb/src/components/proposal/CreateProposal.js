import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, DialogActions, DialogContent, DialogTitle, Dialog, MenuItem, Grid, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const _baseApi = process.env.REACT_APP_BASE_API;


const CreateProposal = ({ onClose }) => {
  const [formState, setFormState] = useState({
    customer: '',
    send_date: '',
    valid_date: '',
    customer_email: '',
    description: '',
    items: [],
    tax_rate: 0,
    discount_percent: 0
  });

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get(`${_baseApi}/users/customer/?status=False`);
        const serviceResponse = await axios.get(`${_baseApi}/proposal/service-item/`);
        setCustomers(customerResponse.data);
        setServices(serviceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'customer') {
      const selectedCustomer = customers.find(customer => customer.id === value);
      if (selectedCustomer) {
        setFormState(prevState => ({
          ...prevState,
          customer_email: selectedCustomer.email
        }));
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = formState.items.map((item, i) => (
      i === index ? { ...item, [field]: value } : item
    ));
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormState(prevState => ({
      ...prevState,
      items: [...prevState.items, { service_item: '', quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formState.items.filter((item, i) => i !== index);
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${_baseApi}/proposal/manage-proposals/`, formState);
      console.log('Proposal created:', response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const calculateSubtotal = () => {
    return formState.items.reduce((acc, item) => {
      const service = services.find(service => service.id === item.service_item);
      return acc + (service ? service.price_per_unit * item.quantity : 0);
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return (subtotal * formState.tax_rate) / 100;
  };

  const calculateDiscount = (subtotal) => {
    return (subtotal * formState.discount_percent) / 100;
  };

  const calculateTotal = (subtotal, tax, discount) => {
    return subtotal + tax - discount;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(subtotal);
  const total = calculateTotal(subtotal, tax, discount);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Proposal</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                margin="dense"
                name="customer"
                label="Customer"
                fullWidth
                variant="outlined"
                value={formState.customer}
                onChange={handleInputChange}
              >
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.fullname}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="send_date"
                label="Proposal Send Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formState.send_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="valid_date"
                label="Proposal Valid Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formState.valid_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="customer_email"
                label="Customer Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formState.customer_email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={formState.description}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              />
            </Grid>
            {formState.items.map((item, index) => (
              <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Service Item"
                    value={item.service_item}
                    onChange={(e) => handleItemChange(index, 'service_item', e.target.value)}
                    fullWidth
                  >
                    {services.map(service => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Price per unit"
                    type="text"
                    value={services.find(service => service.id === item.service_item)?.price_per_unit || ''}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => removeItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={addItem}>
                Add Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="tax_rate"
                label="Tax Rate (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.tax_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="discount_percent"
                label="Discount (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.discount_percent}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>Summary</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                  <Typography>Tax: ${tax.toFixed(2)}</Typography>
                  <Typography>Discount: -${discount.toFixed(2)}</Typography>
                  <Typography>Total: ${total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button type="submit" onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProposal;
