import { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box className="collapsible-section">
      <Box
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          cursor: "pointer",
          mt: 6,
          mb: 1,
          outline: "none",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            borderRadius: 1,
          },
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            textAlign: "left",
            flexGrow: 0,
            mr: 1,
          }}
        >
          {title}
        </Typography>
        <Tooltip title={tooltip}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-label={isOpen ? "Colapsar sección" : "Expandir sección"}
          >
            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Grid className="collapsable-dog-grid" container spacing={4}>
          {dogs.map(renderDog)}
        </Grid>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
