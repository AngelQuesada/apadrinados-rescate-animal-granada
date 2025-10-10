import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUIContext } from "../../hooks/context/useUIContext";
import { useDogsContext } from "../../hooks/context/useDogsContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SponsorForm = () => {
  const { sponsorForm, closeSponsorForm } = useUIContext();
  const { sponsors } = useDogsContext();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [emailInputValue, setEmailInputValue] = useState("");

  const isEditMode = sponsorForm.sponsor !== null;

  useEffect(() => {
    if (sponsorForm.isOpen) {
      if (isEditMode) {
        setFormData({
          name: sponsorForm.sponsor.name,
          email: sponsorForm.sponsor.email,
        });
        setEmailInputValue(sponsorForm.sponsor.email);
      } else {
        setFormData({ name: "", email: "" });
        setEmailInputValue("");
      }
      setErrors({ name: "", email: "" });
    }
  }, [sponsorForm.isOpen, sponsorForm.sponsor, isEditMode]);

  const validate = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    // Name validation
    if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor, introduce un email válido.";
      isValid = false;
    } else {
      const isEmailTaken = sponsors.some(
        (sponsor) =>
          sponsor.email.toLowerCase() === formData.email.toLowerCase() &&
          (isEditMode ? sponsor.id !== sponsorForm.sponsor.id : true)
      );
      if (isEmailTaken) {
        newErrors.email = "Este email ya está registrado como sponsor.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        console.log("Updating sponsor:", {
          ...sponsorForm.sponsor,
          ...formData,
        });
      } else {
        console.log("Adding new sponsor:", formData);
      }
      closeSponsorForm();
    }
  };

  const handleClose = () => {
    closeSponsorForm();
  };

  return (
    <Modal open={sponsorForm.isOpen} onClose={handleClose} closeAfterTransition>
      <Fade in={sponsorForm.isOpen}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {isEditMode ? "Editar Sponsor" : "Añadir Nuevo Sponsor"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
            />
            <Autocomplete
              freeSolo
              options={
                emailInputValue.length > 5
                  ? sponsors.filter((sponsor) =>
                      sponsor.email
                        .toLowerCase()
                        .startsWith(emailInputValue.toLowerCase())
                    )
                  : []
              }
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.email
              }
              onChange={(event, newValue) => {
                if (typeof newValue === "object" && newValue !== null) {
                  setFormData({ name: newValue.name, email: newValue.email });
                  setEmailInputValue(newValue.email);
                }
              }}
              inputValue={emailInputValue}
              onInputChange={(event, newInputValue) => {
                setEmailInputValue(newInputValue);
                if (event && event.type === "change") {
                  setFormData({ ...formData, email: newInputValue });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              )}
            />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                {isEditMode ? "Guardar Cambios" : "Añadir Sponsor"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SponsorForm;
