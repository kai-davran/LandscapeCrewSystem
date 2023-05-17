import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from "../../components/Navbar/Navbar";


const History = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}/schedules/assignedjobs/`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching crews:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredHistory = history.filter((h) =>
    h.job_data.customer_data.fullname.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Work History</Typography>
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
          label="Search by customer name"
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
              <TableCell>Crew</TableCell>
              <TableCell>Crew Notes</TableCell>
              <TableCell>Start Hour</TableCell>
              <TableCell>End Hour</TableCell>
              <TableCell>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{h.job_data.customer_data.fullname}</TableCell>
                <TableCell>{h.crew_data.name}</TableCell>
                <TableCell>{h.crew_notes}</TableCell>
                <TableCell>{formatTime(h.start_hour)}</TableCell>
                <TableCell>{formatTime(h.end_hour)}</TableCell>
                <TableCell>{h.total_hours}</TableCell>
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
    </>
  );
};

export default History;
