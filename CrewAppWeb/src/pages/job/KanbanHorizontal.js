import React from "react";
import styled from "@emotion/styled";
import { Droppable } from '@hello-pangea/dnd';
import { Divider } from "@mui/material";
import TaskCard from "./TaskCard";
import { Typography } from "@mui/material";


const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  margin: 0,
}));

const TaskList = styled("div")(() => ({
  minHeight: "100px",
  display: "flex",
  flexDirection: "row",
  background: "#d7dce8",
  width: "100%",
  borderRadius: "5px",
  padding: "15px 15px",
  margin: "0px",
  marginRight: "15px",

}));

const Title = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "18px",
  textAlign: "center",
  width: "100%",
  padding: "8px 0",
  marginBottom: "10px", 
  backgroundColor: "#fff",
  borderRadius: "5px",
}));

const KanbanHorizontal = ({ columns }) => {
  return (
    <Container>
      {Object.entries(columns).map(([columnId, column], index) => {
        return (
          <Droppable key={index} droppableId={`horizontal-${columnId}`} direction="horizontal">
            {(provided) => (
              <>
                <Title variant="h6">{column.title}</Title>
                <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                  <Divider orientation="vertical" flexItem />
                  {column.items.map((item, index) => (
                    <TaskCard key={index} item={item} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              </>
            )}
          </Droppable>
        );
      })}
    </Container>
  );
};

export default KanbanHorizontal;
