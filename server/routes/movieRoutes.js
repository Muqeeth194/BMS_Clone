const router = require("express").Router();
const dbMovies = require("../model/movieModel");

// Add the movie
router.post("/add", async (req, res) => {
  try {
    const movie = new dbMovies(req.body);
    movie.save();

    res.send({
      success: true,
      message: "Movie created",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get all the movies
router.get("/getAllMovies", async (req, res) => {
  try {
    const movies = await dbMovies.find();
    res.send({
      success: true,
      message: "Movies are fetched successfully",
      data: movies,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.get("/getMovieById/:movieId", async (req, res) => {
  try {
    const movieId = req.params.movieId
    const movies = await dbMovies.findOne({_id: movieId});
    res.send({
      success: true,
      message: "Movies are fetched successfully",
      data: movies,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    await dbMovies.findByIdAndDelete(req.body.movieId);
    res.send({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.put("/update", async (req, res) => {
  try {
    await dbMovies.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Movie is updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

exports.router = router;
