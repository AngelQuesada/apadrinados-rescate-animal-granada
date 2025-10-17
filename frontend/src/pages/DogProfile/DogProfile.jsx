import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import useDogProfile from "../../hooks/components/useDogProfile";

const DogProfile = () => {
  const {
    profileDog,
    name,
    imageUrl,
    dogSponsors,
    modified,
    menuRef,
    loading,
    selectedSponsors,
    bottomPadding,
    selectedSponsor,
    handleSelectSponsor,
    handleOpenSponsorForm,
    handleDeleteSelection,
    handleDeleteSponsor,
    openSponsorForm,
    loadingDeleteDogSponsor,
  } = useDogProfile();

  // TODO: Tenemos nuestro propio componente de carga
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profileDog) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Perro no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: `${bottomPadding}px` }}>
      <Paper sx={{ p: 3, mb: 3, display: "flex", alignItems: "center" }}>
        <Avatar
          src={imageUrl}
          alt={name}
          sx={{ width: 120, height: 120, mr: 3 }}
        />
        <Box>
          <Typography variant="h3">{name}</Typography>
          <Typography variant="caption">
            Modificado: {new Date(modified).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h4" gutterBottom>
        Padrinos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          {/* Cabecera Tabla */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ color: "white" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell
                sx={{
                  color: "white",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Fecha de creación
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Origen
              </TableCell>
              <TableCell sx={{ color: "white" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* Body Tabla */}
          <TableBody>
            {dogSponsors.map((sponsor) => {
              const isPaypalSponsor = sponsor.source === 1;
              const isSelected = selectedSponsors.includes(
                sponsor.dog_sponsor_id
              );

              return (
                <TableRow
                  key={sponsor.dog_sponsor_id}
                  sx={{
                    "& .MuiTableCell-root": {
                      fontSize: { xs: "0.75rem", md: "1rem" },
                    },
                  }}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      disabled={isPaypalSponsor}
                      checked={isSelected}
                      onChange={() =>
                        handleSelectSponsor(sponsor.dog_sponsor_id)
                      }
                    />
                  </TableCell>
                  {/* Nombre */}
                  <TableCell>{sponsor.name}</TableCell>
                  {/* Email */}
                  <TableCell>{sponsor.email}</TableCell>
                  {/* Fecha de Creación */}
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {new Date(sponsor.created_at).toLocaleDateString()}
                  </TableCell>
                  {/* Origen */}
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {isPaypalSponsor && (
                      <Tooltip title="PayPal">
                        <FontAwesomeIcon
                          icon={faPaypal}
                          style={{ color: "#333333" }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  {/* Acciones */}
                  <TableCell>
                    <Tooltip title="Editar">
                      <span>
                        <IconButton
                          disabled={isPaypalSponsor}
                          onClick={() => openSponsorForm(sponsor)}
                        >
                          <Edit />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <span>
                        <IconButton
                          loading={
                            loadingDeleteDogSponsor &&
                            selectedSponsor === sponsor.dog_sponsor_id
                          }
                          onClick={() => {
                            handleDeleteSponsor(sponsor.dog_sponsor_id);
                          }}
                          disabled={isPaypalSponsor}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu Flotante */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Paper
          ref={menuRef}
          elevation={3}
          sx={{
            display: "flex",
            gap: 2,
            p: 1,
            borderRadius: "16px",
            mb: "5px",
          }}
        >
          <Tooltip title="Añadir Padrino">
            <IconButton onClick={handleOpenSponsorForm} color="primary">
              <Add />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar seleccionados">
            <span>
              <IconButton
                onClick={handleDeleteSelection}
                disabled={selectedSponsors.length === 0}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </Paper>
      </Box>
    </Box>
  );
};

export default DogProfile;
