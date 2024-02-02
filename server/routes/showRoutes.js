const router = require("express").Router();
const dbShows = require("../model/showModel");

// Add the Show
router.post("/add", async (req, res) => {
  try {
    const show = new dbShows(req.body);
    show.save();

    res.send({
      success: true,
      message: "Show is created",
      data: show
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error to Add",
    });
  }
});

// Get all the shows by theatreId
// since the get http method cannot take the req.body we are passing the userId as a path param
router.get("/getAllShowsByTheatre/:theatreId", async (req, res) => {
  try {
    const theatreId = req.params.theatreId
    const shows = await dbShows.find({theatre: theatreId}).populate('movie')
    res.send({
      success: true,
      message: "Shows are fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error
    });
  }
});

router.get("/getShowById/:showId", async (req, res) => {
  try {
    const showId = req.params.showId
    const shows = await dbShows.findOne({_id: showId}).populate('movie').populate('theatre')
    res.send({
      success: true,
      message: "Show fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error
    });
  }
});

// Get all the theatres for the admin to approve the theatres
// router.get('/getAllTheatres', async(req, res) => {
//   try {
//     const theatres = await dbTheatres.find().populate('owner')
//     res.send({
//       success: true,
//       message: 'All theatres fetched successfully',
//       data: theatres
//     })
//   } catch (error) {
//     res.send({
//       success: false,
//       message: 'Something went wrong',
//       data: error
//     })
//   }
// })

router.post("/delete", async (req, res) => {
  try {
    await dbShows.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "Show is deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

// router.put("/update", async (req, res) => {
//   try {
//     await dbTheatres.findByIdAndUpdate(req.body.theatreId, req.body);
//     res.send({
//       success: true,
//       message: "Theatre is updated successfully",
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// });

exports.router = router;
