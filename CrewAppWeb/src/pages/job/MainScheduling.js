import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

import { DragDropContext } from '@hello-pangea/dnd';
import KanbanHorizontal from "./KanbanHorizontal";
import KanbanVertical from "./KanbanVertical";
import { columnsFromBack, unscheduled } from "./KanbanData";
import styled from "@emotion/styled";
import ServerService from "../../services/ServerService"; // Adjust the import path as needed

import { v4 as uuidv4 } from "uuid";
import { format, startOfWeek, endOfWeek, addWeeks, parseISO, startOfDay } from 'date-fns';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Typography, IconButton, Dialog, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import CreateOneTimeJob from "../../components/jobs/CreateOneTimeJob"; 
import CreateRecurringJob from "../../components/jobs/CreateRecurringJob"; 


const KanbanContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "20px"
}));

const Container = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    width: "100%"
});

const StyledTypography = styled(Typography)({
    fontSize: "1.5rem",
    margin: "0 200px"
});

const StyledIconButton = styled(IconButton)({
    color: 'black',
});


const KanbanBoard = () => {
    const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
    const [isCreateRecurringJobOpen, setIsCreateRecurringJobOpen] = useState(false);

    const handleAddSingleJob = () => {
        setIsCreateJobOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsCreateJobOpen(false); // Close the modal
    };

    const handleAddRecurringJob = () => {
        setIsCreateRecurringJobOpen(true); 
    };

    const handleRecurringCloseModal = () => {
        setIsCreateRecurringJobOpen(false); 
    };


    const [columns, setColumns] = useState({
        vertical: { ...columnsFromBack },
        horizontal: unscheduled
    });
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [currentWeekEnd, setCurrentWeekEnd] = useState(() => endOfWeek(new Date(), { weekStartsOn: 1 }));
    const [crews, setCrews] = React.useState([]);
    const [selectedCrew, setSelectedCrew] = React.useState('');

    useEffect(() => {
        const fetchCrewsData = async () => {
            try {
                const response = await ServerService.fetchCrews();
                if (response && Array.isArray(response.data)) {
                    setCrews(response.data);
                if (response.data.length > 0) {
                    setSelectedCrew(response.data[0].id);
                }
                } else {
                    console.error("Invalid crew data format:", response);
                    setCrews([]); // Ensure crews remains an array
                }
            } catch (error) {
                console.error("Failed to fetch crews:", error);
                setCrews([]); // Avoid `undefined` state
            }
        };
        fetchCrewsData();
    }, []);


    useEffect(() => {
        async function fetchJobsData() {
            const response = await ServerService.getJobs(currentWeekStart, currentWeekEnd, selectedCrew);
            if (!response.hasError) {
                // Start with a fresh structure that includes all weekdays
                const newColumns = { ...columnsFromBack }; 
                Object.keys(newColumns).forEach(day => {
                newColumns[day].items = []; // Clear existing items for each day
                });

                response.data.forEach(job => {
                    const jobDate = startOfDay(parseISO(job.date));
                    const day = jobDate.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });

                    newColumns[day].items.push({
                        id: uuidv4(),
                        customer: job.customer_data.fullname,
                        address: job.customer_data.address,
                        dayofWeek: job.day_of_week,
                        grossRevenue: job.gross_revenue,
                        jobordering: job.job_ordering,
                        totalmanhours: job.total_man_hours,
                        instruction: job.instructions_for_crew,
                        status: job.status,
                        date: job.date,
                        startday: day
                    });
                });

                // Ensure that all days, including those without jobs, are maintained in the state
                setColumns({ vertical: newColumns, horizontal: unscheduled });
            } else {
                console.error("Failed to fetch jobs:", response.data);
            }
        }
        fetchJobsData();
    }, [currentWeekStart, currentWeekEnd, selectedCrew]);


    const handleWeekChange = (direction) => {
        setCurrentWeekStart(prev => {
            const newStart = addWeeks(prev, direction === 'next' ? 1 : -1);
            setCurrentWeekEnd(endOfWeek(newStart, { weekStartsOn: 1 }));
            return newStart;
        });
    };

    const formattedWeek = `${format(currentWeekStart, 'MMM dd')} – ${format(currentWeekEnd, 'MMM dd')}`;


  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    // Exit if no destination or dropped back to the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
  
    const sourceArea = source.droppableId.split('-')[0];
    const sourceColumnId = source.droppableId.split('-').slice(1).join('-');
    const destArea = destination.droppableId.split('-')[0];
    const destColumnId = destination.droppableId.split('-').slice(1).join('-');
  
    // Access the source and destination columns
    const sourceColumn = columns[sourceArea][sourceColumnId];
    const destColumn = columns[destArea][destColumnId];
  
    if (!sourceColumn || !destColumn) {
      console.error("Column not found", {sourceArea, sourceColumnId, destArea, destColumnId});
      return;
    }
  
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = sourceColumn === destColumn ? sourceItems : Array.from(destColumn.items);
  
    // Moving the item within or between columns
    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);
  

  if (sourceArea === destArea) {
    setColumns(prev => ({
      ...prev,
      [sourceArea]: {
        ...prev[sourceArea],
        [sourceColumnId]: { ...sourceColumn, items: sourceItems },
        [destColumnId]: { ...destColumn, items: destItems },

      }}));
  } else {
    setColumns(prev => ({
      ...prev,
      [sourceArea]: {
        ...prev[sourceArea],
        [sourceColumnId]: { ...sourceColumn, items: sourceItems }
      },
      [destArea]: {
        ...prev[destArea],
        [destColumnId]: { ...destColumn, items: destItems }
      }
    }));
  }
};
  
  
  return (
    <>
      <Navbar />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box>
          <FormControl size="small" sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel id="crew-select-label">Crew</InputLabel>
            <Select
              labelId="crew-select-label"
              id="crew-select"
              value={selectedCrew}
              label="Crew"
              onChange={(e) => setSelectedCrew(e.target.value)}
              >
              {Array.isArray(crews) && crews.length > 0 ? (
                crews.map((crew) => (
                  <MenuItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Crews Available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddSingleJob}>Add Single Job</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddRecurringJob} sx={{ ml: 1 }}>Add Recurring Job</Button>
        </Box>
      </Box>
      <Container>
        <StyledIconButton onClick={() => handleWeekChange('prev')}>
          <ArrowBackIosIcon />
        </StyledIconButton>
        <StyledTypography>{formattedWeek}</StyledTypography>
        <StyledIconButton onClick={() => handleWeekChange('next')}>
          <ArrowForwardIosIcon />
        </StyledIconButton>
      </Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <KanbanContainer>
          <KanbanHorizontal columns={columns.horizontal} />
          <KanbanVertical columns={columns.vertical} />
        </KanbanContainer>
      </DragDropContext>
      <Dialog open={isCreateJobOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <CreateOneTimeJob onClose={handleCloseModal} />
      </Dialog>

      <Dialog open={isCreateRecurringJobOpen} onClose={handleRecurringCloseModal} fullWidth maxWidth="md">
        <CreateRecurringJob onClose={handleRecurringCloseModal} />
      </Dialog>
    </>
  );
};

export default KanbanBoard;
