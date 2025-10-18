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
    bgcolor: "secondary.main",
    color: "white",
    border: "1px solid transparent",
    "&:hover": {
      bgcolor: "white",
      color: "secondary.main",
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
      className="dog-card"
      sx={{
        opacity: isPublished ? 1 : 0.6,
        width: "auto",
      }}
    >
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={sponsorCount}
            color="secondary"
          >
            <Avatar
              onClick={openPopupImage}
              src={imageUrl}
              alt={name}
              sx={{
                width: 72,
                height: 72,
                cursor: "pointer",
              }}
            />
          </Badge>
        }
        title={name}
        subheader={`Modificado: ${new Date(modified).toLocaleDateString()}`}
        slotProps={{
          title: { variant: "h5" },
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
