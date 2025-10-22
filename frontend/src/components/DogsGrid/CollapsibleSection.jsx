import { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const CollapsibleSection = ({
  title,
  dogs,
  tooltip,
  initialOpen = false,
  renderDog,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const Title = ({ children }) => (
    <Box
      onClick={() => setIsOpen(!isOpen)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        cursor: "pointer",
        mt: 6,
        mb: 1,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "text.primary",
          textAlign: "left",
        }}
      >
        {children}
      </Typography>
      <Tooltip title={tooltip}>
        <IconButton>
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <Title>{title}</Title>
      <Divider sx={{ mb: 4 }} />
      {isOpen && (
        <Grid container spacing={4}>
          {dogs.map(renderDog)}
        </Grid>
      )}
    </Box>
  );
};

export default CollapsibleSection;
