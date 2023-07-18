import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { green } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useParams } from "react-router-dom";
import date from 'date-and-time';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateReviewModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const CHARACTER_LIMIT = 1500;
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();
  const { course } = useParams(); //gets the field :course from /course/:course
  const [rating, setRating] = React.useState(2.5);

  const [comment, setComment] = React.useState({
    user_review: "",
  });

  const handleChange = (user_review) => (event) => {
    setComment({ ...comment, [user_review]: event.target.value });
  };

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);

      const currentDate = new Date();

      const newReview = {
        class_name: course,
        additional_comments: comment.user_review,
        difficulty: rating*2, //Align with database
        date: date.format(currentDate, 'M/D/YYYY') ,
      };

      async function submitReview(newReview) {
        //Request node server for classes named inputValye
        await axios
          .post(
            process.env.REACT_APP_NODE_SERVER + `/submit-review`,
            newReview
          )
          .then((response) => {
            setSuccess(true);
            setLoading(false);
            //TODO: Render successful snackbar
          })
          .catch((error) => {
            console.error(error);
            //TODO: Render snackbar with error
          });
      }
      submitReview(newReview);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined">
        Write a review for this course
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Write a Review
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              How difficult was this course?
            </Typography>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography>Easy</Typography>
              <Rating
                name="half-rating"
                defaultValue={2.5}
                precision={0.5}
                value={rating}
                onChange={(event, newRating) => {
                    setRating(newRating);
                  }}
              />
              <Typography>Hard</Typography>
            </Stack>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              What are your thoughts on this course?
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <OutlinedInput
                inputProps={{
                  maxlength: CHARACTER_LIMIT,
                }}
                value={comment.user_review}
                onChange={handleChange("user_review")}
                multiline
                rows={5}
                placeholder="Review"
              />
              <Typography
                sx={{ alignSelf: "flex-end" }}
              >{`${comment.user_review.length}/${CHARACTER_LIMIT}`}</Typography>
            </FormControl>
            <Box sx={{ m: 0, position: "relative", width: "fit-content" }}>
              <Button
                variant="contained"
                sx={buttonSx}
                disabled={loading}
                onClick={handleButtonClick}
              >
                Submit Review
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
