import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Dialog, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from "../../components/Navbar/Navbar";
import { styled } from '@mui/system';
import CreateProposal from "../../components/proposal/CreateProposal";

const StatusBox = styled(Box)(({ color }) => ({
  border: `1px solid ${color}`,
  backgroundColor: color,
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  textAlign: 'center',
}));

const ListProposal = () => {
  const [proposal, setProposal] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateProposalOpen, setIsCreateProposalJobOpen] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}/proposal/manage-proposals/`);
        setProposal(response.data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    fetchProposal();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseModal = () => {
    setIsCreateProposalJobOpen(false); 
  };

  const handleAddProposal = () => {
    setIsCreateProposalJobOpen(true);
  };

  const getStatus = (status) => {
    switch (status) {
      case 1:
        return { text: 'Pending', color: 'lightblue' };
      case 2:
        return { text: 'Accepted', color: 'green' };
      case 3:
        return { text: 'Rejected', color: 'red' };
      default:
        return { text: 'Unknown', color: 'gray' };
    }
  };

  const filteredProposals = proposal.filter((proposal) =>
    proposal.customer_data.fullname.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Typography variant="h4">Proposals</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProposal}>
            Send New Proposal
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
                <TableCell>Customer name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Send date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.customer_data.fullname}</TableCell>
                  <TableCell>{proposal.customer_data.address}</TableCell>
                  <TableCell>
                    <StatusBox color={getStatus(proposal.status).color}>
                      {getStatus(proposal.status).text}
                    </StatusBox>
                  </TableCell>
                  <TableCell>{proposal.send_date}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={isCreateProposalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <CreateProposal onClose={handleCloseModal} />
    </Dialog>
    </>
  );
};

export default ListProposal;
