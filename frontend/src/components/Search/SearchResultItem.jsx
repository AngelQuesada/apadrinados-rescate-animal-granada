import {
  Avatar,
  Badge,
  Card,
  CardActions,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContentCopy, Pets } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "#hooks/context/useSnackbar";
import { useUIContext } from "#hooks/context/useUIContext";

const SearchResultItem = ({ name, imageUrl, sponsors, status, id }) => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const sponsorCount = sponsors ? sponsors.length : 0;
  const isPublished = status === "publish";
  const {
    setImagePopupOpen,
    setImageUrlForPopup,
    isSearchOpen,
    setIsSearchOpen,
  } = useUIContext();

  const buttonStyles = {
    bgcolor: "secondary.main",
    color: "white",
    border: "1px solid transparent",
    "&:hover": {
      bgcolor: "white",
      color: "secondary.main",
      borderColor: "primary.main",
    },
    transform: "scale(0.8)",
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
    isSearchOpen && setIsSearchOpen(false);
    navigate(`/dog-profile/${id}`);
  };

  return (
    <Card
      sx={{ display: "flex", alignItems: "center", p: 1, width: "100%", my: 1 }}
    >
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
          sx={{ width: 56, height: 56, cursor: "pointer" }}
        />
      </Badge>
      <Typography variant="h6" sx={{ flexGrow: 1, mx: 2 }}>
        {name}
      </Typography>
      {isPublished && (
        <CardActions>
          <Tooltip title="Ver lista">
            <IconButton onClick={handleClickProfile} sx={buttonStyles}>
              <Pets />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copiar todos los emails">
            <IconButton
              sx={buttonStyles}
              onClick={handleCopyEmails}
              disabled={sponsorCount === 0}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export default SearchResultItem;
