import { Box, Divider, Grid, Typography } from "@mui/material";
import DogCard from "../DogCard/DogCard";
import { useDogsContext } from "../../hooks/context/useDogsContext";

const DogsGrid = () => {
  const { allDogs } = useDogsContext();

  const dogsWithSponsors = [];
  const dogsWithoutSponsorsPublished = [];
  const dogsNotPublished = [];

  const gridStyles = {
    width: {
      xs: "100%",
      sm: "auto",
    },
  };

  if (allDogs) {
    allDogs.forEach((dog) => {
      if (dog.status !== "publish") {
        dogsNotPublished.push(dog);
      } else if (dog.sponsors && dog.sponsors.length > 0) {
        dogsWithSponsors.push(dog);
      } else {
        dogsWithoutSponsorsPublished.push(dog);
      }
    });
  }

  const renderDog = (dog) => (
    <Grid
      className="grid-dog-card"
      sx={gridStyles}
      size={{ xs: 12, sm: 12, md: 6 }}
      key={dog.id}
    >
      <DogCard {...dog} />
    </Grid>
  );

  return (
    <Box>
      {dogsWithSponsors.length > 0 && (
        <>
          <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 1 }}>
            Apadrinados
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={2} justifyContent="center">
            {dogsWithSponsors.map(renderDog)}
          </Grid>
        </>
      )}

      {dogsWithoutSponsorsPublished.length > 0 && (
        <>
          <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 1 }}>
            Sin apadrinar
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={2} justifyContent="center">
            {dogsWithoutSponsorsPublished.map(renderDog)}
          </Grid>
        </>
      )}

      {dogsNotPublished.length > 0 && (
        <>
          <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 1 }}>
            No disponibles
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={2} justifyContent="center">
            {dogsNotPublished.map(renderDog)}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DogsGrid;
