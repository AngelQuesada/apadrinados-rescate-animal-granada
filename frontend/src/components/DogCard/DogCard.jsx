import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ContentCopy, Pets } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useUIContext } from "../../hooks/context/useUIContext";
import { useSnackbar } from "../../hooks/context/useSnackbar";

const DogCard = ({ name, imageUrl, sponsors, status, modified, id }) => {
  const { showSnackbar } = useSnackbar();
  const sponsorCount = sponsors ? sponsors.length : 0;
  const isPublished = status === "publish";
  const { setImagePopupOpen, setImageUrlForPopup } = useUIContext();

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

  return (
    <Card className="dog-card" sx={{ opacity: isPublished ? 1 : 0.6 }}>
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
              sx={{ width: 72, height: 72, cursor: "pointer" }}
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
            <Tooltip title="Ir al perfil">
              <Link
                to={`/dog-profile/${id}`}
                style={{ textDecoration: "none" }}
              >
                <IconButton sx={buttonStyles}>
                  <Pets />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Copiar lista">
              <IconButton
                sx={buttonStyles}
                onClick={handleCopyEmails}
                disabled={sponsorCount === 0}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default DogCard;
