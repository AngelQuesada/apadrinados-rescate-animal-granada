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
import { ContentCopy, FormatListBulleted } from "@mui/icons-material";
import { useUIContext } from "../../hooks/context/useUIContext";
import { Link } from "react-router-dom";

const DogCard = ({ name, imageUrl, sponsors, status, modified, id }) => {
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
            <Tooltip title="Ver lista">
              <Link
                to={`/dog-profile/${id}`}
                style={{ textDecoration: "none" }}
              >
                <IconButton sx={buttonStyles}>
                  <FormatListBulleted />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Copiar lista">
              <IconButton sx={buttonStyles}>
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
