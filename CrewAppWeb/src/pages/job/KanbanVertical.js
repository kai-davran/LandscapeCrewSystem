import React from "react";
import styled from "@emotion/styled";
import { Droppable } from '@hello-pangea/dnd';
import { Grid, Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import TaskCard from "./TaskCard";

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  margin: 0,
  width: "100%",
  overflowX: "auto", 
}));

const TaskList = styled("div")(() => ({
  minHeight: "100px",
  display: "flex",
  flexDirection: "column",
  background: "#d7dce8",
  borderRadius: "5px",
  padding: "15px 15px",
  marginRight: "15px",
  width: "100%",

}));

const TaskColumnStyles = styled("div")(() => ({
  display: "flex",
  flexWrap: "nowrap",  // Prevent wrapping of columns
  width: "100%",
  minHeight: "80vh",
}));

const Title = styled("span")(() => ({
  display: "block",  // Make it block to fill the container
  fontWeight: "bold",
  color: "#333333",
  fontSize: "18px",
  lineHeight: "24px",  // Adjust line height for vertical alignment
  textAlign: "center",  // Center the text
  width: "100%",  // Ensure it spans the full width
  padding: "8px 0",  // Vertical padding
  margin: "0",  // Remove any default margins
  background: "#ffffff",  // White background to match your border
  border: "2px solid #ffffff",  // White border
}));


const KanbanVertical = ({ columns }) => {
  return (
    <Container>
      <TaskColumnStyles>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <Droppable key={index} droppableId={`vertical-${columnId}`}>
              {(provided) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Box sx={{ width: "100%" }}>
                    <Grid
                      container
                      justifyContent="center"  
                      alignItems="center" 
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12}>
                        <Title>{column.title}</Title>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  {column.items.map((item, index) => (
                    <TaskCard key={index} item={item} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          );
        })}
      </TaskColumnStyles>
    </Container>
  );
};

export default KanbanVertical;
