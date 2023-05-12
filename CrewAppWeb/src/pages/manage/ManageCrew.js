import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Dialog, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from "../../components/Navbar/Navbar";
import CreateCrews from "../../components/Users/CreateCrews";


const ManageCrews = () => {
  const [crews, setCrews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateCrewOpen, setIsCreateCrewJobOpen] = useState(false);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}/users/crew`);
        setCrews(response.data);
      } catch (error) {
        console.error('Error fetching crews:', error);
      }
    };
    fetchCrews();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseModal = () => {
    setIsCreateCrewJobOpen(false); 
  };

  const handleAddCrew = () => {
    setIsCreateCrewJobOpen(true); 
  };


  const filteredCrews = crews.filter((crew) =>
    crew.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
     <Navbar />
     <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
      }}
     >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1000,
          mb: 2,
        }}
      >
        <Typography variant="h4">Crews</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddCrew}>
          Add Crew
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1000,
          mb: 2,
        }}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{ marginRight: 2 }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 1000 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Crew</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCrews.map((crew) => (
              <TableRow key={crew.id}>
                <TableCell>{crew.name}</TableCell>
                <TableCell>{crew.phone}</TableCell>
                <TableCell>{crew.email}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    <Dialog open={isCreateCrewOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <CreateCrews onClose={handleCloseModal} />
    </Dialog>

    </>
  );
};

export default ManageCrews;
