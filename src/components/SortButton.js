import SortIcon from "@mui/icons-material/Sort";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import TodayIcon from "@mui/icons-material/Today";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Menu, Button, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";

function SortButton({ reviews, setReviews }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sortReviews = (sortType) => {
    if (sortType === "date") {
      const sortedReviews = [...reviews].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setReviews(sortedReviews);
    } else if (sortType === "highestdifficulty") {
      const sortedReviews = [...reviews].sort((a, b) => {
        return b.difficulty - a.difficulty;
      });
      setReviews(sortedReviews);
    } else if (sortType === "lowestdifficulty") {
      const sortedReviews = [...reviews].sort((a, b) => {
        return a.difficulty - b.difficulty;
      });
      setReviews(sortedReviews);
    } else if (sortType === "mosthelpful") {
      const sortedReviews = [...reviews].sort((a, b) => {
        return b.like - b.dislike - (a.like - a.dislike);
      });
      setReviews(sortedReviews);
    } else if (sortType === "leasthelpful") {
      const sortedReviews = [...reviews].sort((a, b) => {
        return b.dislike - b.like - (a.dislike - a.like);
      });
      setReviews(sortedReviews);
    }
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button
          sx={{
            width: "170px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          variant="contained"
          startIcon={<SortIcon />}
          endIcon={<ArrowDropDownIcon />}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          color="accent"
        >
          Sort By...
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              sortReviews("date");
            }}
          >
            <TodayIcon color="text"/>
            <Typography color="text.main">
              Date
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              sortReviews("highestdifficulty");
            }}
          >
            <StarIcon color="text"/>
            <Typography color="text.main">
              Highest Difficulty
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              sortReviews("lowestdifficulty");
            }}
          >
            <StarHalfIcon color="text"/>
            <Typography color="text.main">
              Lowest Difficulty
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              sortReviews("mosthelpful");
            }}
          >
            <ThumbUpOffAltIcon color="text"/>
            <Typography color="text.main">
              Most Helpful
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              sortReviews("leasthelpful");
            }}
          >
            <ThumbDownOffAltIcon color="text"/>
            <Typography color="text.main">
              Least Helpful
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
}

export default SortButton;
