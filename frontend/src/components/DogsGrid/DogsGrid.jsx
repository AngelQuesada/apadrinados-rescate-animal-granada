import { Box, Divider, Grid, Typography } from "@mui/material";
import { useDogsContext } from "#hooks/context/useDogsContext";
import CollapsibleSection from "./CollapsibleSection";
import DogCard from "#components/DogCard/DogCard";

const DogsGrid = () => {
  const { allDogs } = useDogsContext();

  const dogsWithSponsors = [];
  const dogsWithoutSponsorsPublished = [];
  const dogsNotPublished = [];

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
    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} key={dog.id}>
      <DogCard {...dog} />
    </Grid>
  );

  const Title = ({ children }) => (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        mt: 6,
        mb: 1,
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "left",
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
          <Grid container spacing={{xs:1,sm:2,md:4}}>
            {dogsWithSponsors.map(renderDog)}
          </Grid>
        </>
      )}

      {dogsWithoutSponsorsPublished.length > 0 && (
        <CollapsibleSection
          title="Sin apadrinar"
          dogs={dogsWithoutSponsorsPublished}
          tooltip="Cargar perros sin apadrinar"
          renderDog={renderDog}
        />
      )}

      {dogsNotPublished.length > 0 && (
        <CollapsibleSection
          title="No disponibles"
          dogs={dogsNotPublished}
          tooltip="Cargar perros no disponibles"
          renderDog={renderDog}
        />
      )}
    </Box>
  );
};

export default DogsGrid;
