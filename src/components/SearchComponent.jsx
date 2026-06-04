import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CssBaseline from "@mui/material/CssBaseline";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ArticleCard from "./ArticleCard";
import Link from "@mui/material/Link";
import "./SearchComponent.css";
import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Typography,
  Box,
  Stack,
  Container,
  Fab,
  Toolbar,
  Skeleton,
  Snackbar,
  useMediaQuery,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";

// Runtime-configurable API base + URL style. Host (PHP template or nginx
// envsubst) sets BEFORE this bundle loads:
//   window.APP_CONFIG = { apiBase: "...", apiStyle: "query" | "path" }
//
// The SAME bundle supports two integration shapes:
//   "query" (DEFAULT): `${apiBase}?query=<text>[&mode=poetry|&mode=semantic]`
//       For the PHP proxy (search_api_proxy.php), which reads $_GET['query'].
//       Default so existing prod deployments that set only `apiBase` keep
//       working without change.
//   "path": `${apiBase}/searchTemplate/<text>`, `/searchPoetry/<text>`,
//       `/searchSemantic/<text>`. For the same-origin nginx (search-ui) that
//       reverse-proxies those paths to Spring Boot, and for hitting Spring
//       Boot directly. Use apiBase="." (or "") for same-origin.
const API_BASE =
  (typeof window !== "undefined" && window.APP_CONFIG && window.APP_CONFIG.apiBase) ||
  "http://localhost:8080";
const API_STYLE =
  (typeof window !== "undefined" && window.APP_CONFIG && window.APP_CONFIG.apiStyle) ||
  "query";

// Map a logical search mode to its Spring endpoint / proxy flag.
//   "normal"   -> lexical search      (/searchTemplate)
//   "semantic" -> kNN vector search   (/searchSemantic; needs embed-service)
//   "poetry"   -> BhaktiGanga search  (/searchPoetry)
const MODE_PATH = { normal: "searchTemplate", semantic: "searchSemantic", poetry: "searchPoetry" };

// Build the search URL for the configured style. Trailing slashes on apiBase
// are normalized so ".", "", "http://host:8080" and "http://host:8080/" all
// behave.
function buildSearchUrl(searchText, mode) {
  const text = encodeURIComponent(searchText.trim());
  if (API_STYLE === "query") {
    const modeParam = mode === "normal" ? "" : `&mode=${mode}`;
    return `${API_BASE}?query=${text}${modeParam}`;
  }
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${MODE_PATH[mode] || MODE_PATH.normal}/${text}`;
}

function SearchComponent() {
  const [searchText, setSearchText] = React.useState("");
  const [listOfWrappedArticles, setListOfWrappedArticles] = useState([]);
  const [error, setError] = React.useState(null);
  // "normal" | "semantic" | "poetry"
  const [searchMode, setSearchMode] = useState("normal");

  const onSearchTextChangeHandler = (event) => {
    setSearchText(event.target.value);
  };

  const onSearchClickHandler = (event) => {
    event.preventDefault();
    setError(null);
    if (
      searchText === undefined ||
      searchText === "" ||
      searchText === null ||
      searchText.trim() === ""
    ) {
      setError("Please enter search query");
      setListOfWrappedArticles([]);
      return;
    }
    setListOfWrappedArticles([]);
    fetchResults(searchMode);
    setError(null);
  };

  const handleClearSearchText = (event) => {
    setSearchText("");
  };

  const onSearchKeyDownHandler = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      console.log("enter");
    }
  };

  const fetchResults = async (mode) => {
    try {
      setError(null);
      // URL shape depends on APP_CONFIG.apiStyle (query for the PHP proxy,
      // path for the same-origin nginx / direct Spring). See buildSearchUrl.
      const searchUrl = buildSearchUrl(searchText, mode);
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!response.ok) {
        if (data.status === 400) {
          setError("No Articles Found. Please modify search query");
        } else {
          setError(
            "Something went wrong. Please try again later or change search query."
          );
        }
        setListOfWrappedArticles([]);
        return;
      }
      setListOfWrappedArticles(data["listOfWrappedArticles"]);
    } catch (err) {
      setError("Server is unreachable. Please contact administrator.");
      setListOfWrappedArticles([]);
    }
  };
  // Legacy mapper for the PHP-served BhaktiGanga endpoint — preserved for reference.
  // const mapBhakthiGangaESResponseToArticles = (esResponse) => {
  //   if (!esResponse) return [];
  //   const toArticle = (item) => ({
  //     masterId: item?._id ?? null,
  //     bhakthiGangaId: item?._source?.id ?? null,
  //     article: { title: item?._source?.title ?? null },
  //     score: item?._score ?? 0,
  //     highlight: item?.highlight?.lyrics ?? item?.highlight?.trackname ?? [],
  //   });
  //   const lyricsArticles = Array.isArray(esResponse.lyricsData)
  //     ? esResponse.lyricsData.map(toArticle)
  //     : [];
  //   const trackArticles = Array.isArray(esResponse.trackData)
  //     ? esResponse.trackData.map(toArticle)
  //     : [];
  //   return [...lyricsArticles, ...trackArticles];
  // };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container sx={{}}>
        <Stack
          id="mainStack"
          sx={{ mb: "2%" }}
          direction={"column"}
          justifyContent="center"
        >
          <Stack id="stackOne" justifyContent={"center"} direction={"column"}>
            {window.APP_CONFIG && window.APP_CONFIG.heroImage && (
              <div id="lordDattaImage">
                <img
                  src={window.APP_CONFIG.heroImage}
                  alt=""
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}

            <Box fullwidth="true">
              <Link
                href="https://www.universal-spirituality.org/"
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                {"Universal-Spirituality"}
              </Link>
            </Box>
          </Stack>
          <Stack
            component="form"
            id="stackTwo"
            sx={{ my: "1%" }}
            direction={"column"}
          >
            <TextField
              id="search-text-field"
              label="Search..."
              variant="outlined"
              value={searchText}
              onChange={onSearchTextChangeHandler}
              inputProps={{ maxLength: 50 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClearSearchText}
                      edge="end"
                    >
                      <ClearTwoToneIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              onClick={onSearchClickHandler}
            >
              Search
            </Button>
            <FormControl sx={{ alignSelf: "flex-end", marginRight: 0 }}>
              <FormLabel id="search-mode-label">Search mode</FormLabel>
              <RadioGroup
                row
                aria-labelledby="search-mode-label"
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
              >
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="semantic" control={<Radio />} label="Semantic" />
                <FormControlLabel value="poetry" control={<Radio />} label="Bhakthi Ganga" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Stack>
        <Stack justifyContent="center" alignItems="center" sx={{ mx: "5%" }}>
          {error && <div> {error}</div>}
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }} spacing={3}>
            {listOfWrappedArticles.map((wrappedArticle) => (
              <ArticleCard
                key={wrappedArticle.article.masterId}
                article={wrappedArticle.article}
                score={wrappedArticle.score}
                highlight={wrappedArticle.highlight}
              />
            ))}
          </Masonry>
        </Stack>
      </Container>
    </React.Fragment>
  );
}

export default SearchComponent;
