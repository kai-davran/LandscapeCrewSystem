import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from "../../components/Navbar/Navbar";
import CreateCrewMembers from "../../components/Users/CreateCrewMembers";


const ManageCrewMembers = () => {
  const [crewmembers, setCrewMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateCrewMemberOpen, setIsCreateCrewMemberOpen] = useState(false);


  useEffect(() => {
    const fetchCrewMembers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}/users/crewmember`);
        setCrewMembers(response.data);
      } catch (error) {
        console.error('Error fetching crew members:', error);
      }
    };
    fetchCrewMembers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseModal = () => {
    setIsCreateCrewMemberOpen(false); 
  };

  const handleAddCrewMember = () => {
    setIsCreateCrewMemberOpen(true)
  };


  const filteredCrews = crewmembers.filter((crewmember) =>
    crewmember.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Crew Members</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddCrewMember}>
          Add Crew Member
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
              <TableCell>Crew Member</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Crew</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCrews.map((crewmember) => (
              <TableRow key={crewmember.id}>
                <TableCell>{crewmember.name}</TableCell>
                <TableCell>{crewmember.phone}</TableCell>
                <TableCell>{crewmember.email}</TableCell>
                <TableCell>{crewmember.crew_data.name}</TableCell>

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

    <Dialog open={isCreateCrewMemberOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <CreateCrewMembers onClose={handleCloseModal} />
    </Dialog>

    </>
  );
};

export default ManageCrewMembers;
