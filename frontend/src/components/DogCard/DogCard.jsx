import {
  Avatar,
  Badge,
  Box,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ContentCopy, Pets } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUIContext } from "#hooks/context/useUIContext";
import { useSnackbar } from "#hooks/context/useSnackbar";

const DogCard = ({ name, imageUrl, sponsors, status, modified, id }) => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setImagePopupOpen, setImageUrlForPopup } = useUIContext();

  const sponsorCount = sponsors ? sponsors.length : 0;
  const isPublished = status === "publish";

  const buttonStyles = {
    color: "primary.main",
    border: "1px solid transparent",
    "&:hover": {
      bgcolor: "primary.main",
      color: "white",
      borderColor: "primary.main",
    },
  };

  const openPopupImage = () => {
    setImageUrlForPopup(imageUrl);
    setImagePopupOpen(true);
  };

  const handleCopyEmails = () => {
    if (sponsors && sponsors.length > 0) {
      const emails = sponsors.map((sponsor) => sponsor.email).join(", ");
      navigator.clipboard.writeText(emails);
      showSnackbar("Emails copiados al portapapeles", "success");
    }
  };

  const handleClickProfile = () => {
    navigate(`/dog-profile/${id}`);
  };

  return (
    <Card
      data-testid="dog-card"
      className="dog-card"
      sx={{
        opacity: isPublished ? 1 : 0.6,
        width: "auto",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={sponsorCount}
            variant="standard"
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "1rem",
                fontWeight: "bold",
                minWidth: "30px",
                height: "30px",
                padding: "0 7px",
              },
            }}
          >
            <Avatar
              onClick={openPopupImage}
              src={imageUrl}
              alt={name}
              sx={{
                width: 72,
                height: 72,
                cursor: "pointer",
                border: "2px solid white",
              }}
            />
          </Badge>
        }
        title={name}
        subheader={`Modificado: ${new Date(modified).toLocaleDateString()}`}
        slotProps={{
          title: { variant: "h5", fontWeight: "bold" },
          subheader: { variant: "caption" },
        }}
      />
      {isPublished && (
        <>
          <Divider variant="middle" />
          <CardActions sx={{ justifyContent: "center" }}>
            <Tooltip title="Ver lista">
              <IconButton onClick={handleClickProfile} sx={buttonStyles}>
                <Pets />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copiar todos los emails">
              <Box component="span">
                <IconButton
                  sx={buttonStyles}
                  onClick={handleCopyEmails}
                  disabled={sponsorCount === 0}
                >
                  <ContentCopy />
                </IconButton>
              </Box>
            </Tooltip>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default DogCard;
