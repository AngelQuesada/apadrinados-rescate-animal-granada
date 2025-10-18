import { useState } from "react";
import {
  Box,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  GlobalStyles,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDogsContext } from "#hooks/context/useDogsContext";
import SearchResultItem from "#components/Search/SearchResultItem";
import { useTheme } from "@mui/material/styles";
import { getSearchStyles, bounce } from "#components/Search/searchStyles";

const Search = () => {
  const theme = useTheme();
  const searchStyles = getSearchStyles(theme);
  const { allDogs } = useDogsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      setLoading(true);
      setTimeout(() => {
        const filteredDogs = allDogs.filter((dog) =>
          dog.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredDogs);
        setLoading(false);
      }, 1500);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Box sx={searchStyles.searchContainer}>
      <GlobalStyles styles={bounce} />
      <OutlinedInput
        placeholder="Nombre del perrito"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        autoFocus
        sx={loading ? searchStyles.searchInput : {}}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      {loading && <CircularProgress sx={searchStyles.loading} />}
      {searchResults.length > 0 && (
        <List sx={searchStyles.resultsContainer}>
          {searchResults.map((dog) => (
            <ListItem key={dog.id} sx={searchStyles.resultItem}>
              <SearchResultItem {...dog} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Search;
