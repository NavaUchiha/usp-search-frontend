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
  Switch,
  FormControlLabel,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";

// Runtime-configurable API base. Host (PHP template or static config.js)
// can set:  window.APP_CONFIG = { apiBase: "https://..." }
// BEFORE this bundle loads. Falls back to localhost for standalone dev.
const API_BASE =
  (typeof window !== "undefined" && window.APP_CONFIG && window.APP_CONFIG.apiBase) ||
  "http://localhost:8080";

function SearchComponent() {
  const [searchText, setSearchText] = React.useState("");
  const [listOfWrappedArticles, setListOfWrappedArticles] = useState([]);
  const [error, setError] = React.useState(null);
  const [enabled, setEnabled] = useState(false);

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
    if (enabled) {
      fetchBhakthiGangaSongs();
    } else {
      fetchArticles();
    }
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

  const fetchArticles = async () => {
    try {
      setError(null);
      // v0.2.0: query-parameter URL shape — works with the PHP proxy at
      //   <apiBase>?query=<text>[&mode=poetry]
      // Same-origin in prod (PHP serves the proxy), no CORS.
      const searchUrl = `${API_BASE}?query=${encodeURIComponent(searchText.trim())}`;
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

  const fetchBhakthiGangaSongs = async () => {
    try {
      setError(null);
      // v0.2.0: query-parameter URL shape with BG-mode flag.
      const searchUrl = `${API_BASE}?query=${encodeURIComponent(searchText.trim())}&mode=poetry`;
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
            <FormControlLabel
              sx={{
                alignSelf: "flex-end",
                marginRight: 0,
              }}
              control={
                <Switch
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
              }
              label="Search Bhakthi Ganga Songs"
            />
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
