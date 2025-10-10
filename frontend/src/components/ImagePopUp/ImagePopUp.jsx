import { alpha, Box, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useUIContext } from "../../hooks/context/useUIContext";
import theme from "../../theme/theme";

const ImagePopup = () => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const {
    imageUrlForPopup,
    imagePopupOpen,
    setImagePopupOpen,
    setImageUrlForPopup,
  } = useUIContext();

  // Styles

  const popUpImageContainerStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "9999",
    backgroundColor: alpha(theme.palette.primary.main, 0.6),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const popupImageStyles = {
    maxWidth: 600,
    width: "100%",
    height: "auto",
    position: "relative",
  };

  const closeIconStyles = {
    marginBottom: 3,
  };

  useEffect(() => {
    setImageUrl(imageUrlForPopup);
    setOpen(imagePopupOpen);
  }, [imagePopupOpen, imageUrlForPopup]);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setImagePopupOpen(false);
      setImageUrlForPopup("");
    }
  };

  return (
    open && (
      <Box
        sx={popUpImageContainerStyles}
        className="popup-image-container"
        component="container"
        onClick={handleClose}
      >
        <Button
          sx={closeIconStyles}
          variant="contained"
          color="secondary"
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Cerrar
        </Button>
        <Box
          className="popup-image"
          sx={popupImageStyles}
          component="img"
          src={imageUrl}
        />
      </Box>
    )
  );
};

export default ImagePopup;
