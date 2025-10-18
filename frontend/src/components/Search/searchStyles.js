export const getSearchStyles = (theme) => ({
  searchContainer: {
    width: 600,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 2,
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
    },
  },
  searchInput: {
    animation: "bounce 1.5s ease-in-out",
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
      "& fieldset": {
        borderColor: "primary.main",
      },
      "&:hover fieldset": {
        borderColor: "primary.dark",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.dark",
      },
    },
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    mt: 2,
  },
  resultItem: {
    width: "100%",
  },
  loading: {
    display: "block",
    margin: "auto",
    mt: 2,
  },
});

export const bounce = `
  @keyframes bounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
