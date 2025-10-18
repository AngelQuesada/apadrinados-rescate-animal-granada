import { Box, Divider, Grid, Typography } from "@mui/material";
import DogCard from "#components/DogCard/DogCard";
import { useDogsContext } from "#hooks/context/useDogsContext";

const DogsGrid = () => {
  const { allDogs } = useDogsContext();

  const dogsWithSponsors = [];
  const dogsWithoutSponsorsPublished = [];
  const dogsNotPublished = [];

  const gridStyles = {
    size: {
      xs: 12,
      sm: 12,
      md: 4,
      lg: 3,
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
    <Grid {...gridStyles} className="grid-dog-card" key={dog.id}>
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
          <Grid container spacing={4}>
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
