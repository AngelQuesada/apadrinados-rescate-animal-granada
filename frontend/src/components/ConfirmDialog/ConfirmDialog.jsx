import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, forwardRef, Fragment } from "react";
import Slide from "@mui/material/Slide";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import { Box, Divider } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialog({
  title,
  content,
  cancelButtonText = "Cancelar",
  acceptButtonText = "Aceptar",
  isOpen = false,
  onAccept,
  onClose,
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        id="confirm-dialog"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ReportProblemOutlined
              sx={{ color: "secondary.main", fontSize: 28 }}
            />
            {title}
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ paddingTop: 2 }}>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleClose}> {cancelButtonText} </Button>
          <Button onClick={handleAccept} data-testid="confirm-dialog-accept-button" olor="secondary" variant="contained">
            {acceptButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
