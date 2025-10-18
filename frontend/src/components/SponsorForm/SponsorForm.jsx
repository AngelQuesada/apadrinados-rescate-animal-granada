import {
  Autocomplete,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { modalStyle } from "#components/SponsorForm/sponsorFormStyles";
import useSponsorForm from "#hooks/components/useSponsorForm";

const SponsorForm = () => {
  const {
    formData,
    errors,
    isEditMode,
    emailInputValue,
    sponsorForm,
    loading,
    setFormData,
    handleSubmit,
    handleClose,
    filterExistingSponsors,
    setEmailInputValue,
  } = useSponsorForm();

  return (
    <Modal open={sponsorForm.isOpen} onClose={handleClose} closeAfterTransition>
      <Fade in={sponsorForm.isOpen}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={loading}
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
              disabled={loading}
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
              options={filterExistingSponsors()}
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
                  disabled={loading}
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
              <Button disabled={loading} onClick={handleClose} sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button loading={loading} type="submit" variant="contained">
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
