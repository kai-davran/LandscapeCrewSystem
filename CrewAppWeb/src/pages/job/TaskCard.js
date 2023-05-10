import * as React from "react";
import {
  Card,
  CardHeader,
  Chip,
  IconButton,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import { Draggable } from '@hello-pangea/dnd';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/system";

const statusLabels = {
  1: 'Scheduled',
  2: 'Unscheduled',
  3: 'In Progress',
  4: 'Done'
};

const statusStyles = {
  1: { background: "#EEFFF3", color: "#1CA13E" },  // Scheduled
  2: { background: "#FFCCBC", color: "#D84315" },  // Unscheduled
  3: { background: "#FFF3E0", color: "#FB8C00" },  // In Progress
  4: { background: "#E0F7FA", color: "#006064" }   // Done
};

const Heading = styled("div")(() => ({
  color: "#333333",
  fontWeight: "bold",
  fontSize: "16px",
}));

const TaskCard = ({ item, index }) => {
  const label = statusLabels[item.status] || 'Unknown';
  const { background, color } = statusStyles[item.status] || { background: '#EEEEEE', color: '#000000' };

  const rightIconAction = (
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  );

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card sx={{ minWidth: 175, m: "8px 1px" }}>
            <CardHeader
              title={<Heading>{item.jobordering}. {item.customer}</Heading>}
              action={rightIconAction}
              titleTypographyProps={{ sx: { fontSize: 14, fontWeight: 'bold', color: 'text.primary' } }}
            />
            <CardContent sx={{ p: "0 16px" }}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {item.address}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Estimated man hours: {item.totalmanhours}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Instruction: {item.instruction}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Amount per visit: {item.grossRevenue} $
              </Typography>
            </CardContent>
            <CardActions>
              <Chip
                label={label}
                sx={{
                  m: 1,
                  minWidth: "70px",
                  maxHeight: "25px",
                  background: background,
                  color: color,
                }}
                variant="outlined"
              />
            </CardActions>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
export default TaskCard;
