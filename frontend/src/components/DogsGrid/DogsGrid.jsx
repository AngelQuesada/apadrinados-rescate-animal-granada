import { Box, Divider, Grid, Typography } from "@mui/material";
import DogCard from "#components/DogCard/DogCard";
import { useDogsContext } from "#hooks/context/useDogsContext";

const DogsGrid = () => {
  const { allDogs } = useDogsContext();

  const dogsWithSponsors = [];
  const dogsWithoutSponsorsPublished = [];
  const dogsNotPublished = [];

  const gridStyles = {
    width: {
      xs: "100%",
      sm: "100%",
      md: "auto",
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
      item
      xs={12}
      sm={6}
      md={4}
      key={dog.id}
    >
      <DogCard {...dog} />
    </Grid>
  );

  const Title = ({ children }) => (
    <Typography
      variant="h4"
      component="h2"
      sx={{
        mt: 6,
        mb: 1,
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box>
      {dogsWithSponsors.length > 0 && (
        <>
          <Title>Apadrinados</Title>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4} justifyContent="center">
            {dogsWithSponsors.map(renderDog)}
          </Grid>
        </>
      )}

      {dogsWithoutSponsorsPublished.length > 0 && (
        <>
          <Title>Sin apadrinar</Title>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4} justifyContent="center">
            {dogsWithoutSponsorsPublished.map(renderDog)}
          </Grid>
        </>
      )}

      {dogsNotPublished.length > 0 && (
        <>
          <Title>No disponibles</Title>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4} justifyContent="center">
            {dogsNotPublished.map(renderDog)}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DogsGrid;
