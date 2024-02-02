const router = require("express").Router();
const dbTheatres = require("../model/theatreModel");
const dbShows = require("../model/showModel")

// Add the movie
router.post("/add", async (req, res) => {
  try {
    const theatre = new dbTheatres(req.body);
    theatre.save();

    res.send({
      success: true,
      message: "Theatre is created",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error to Add",
    });
  }
});

// Get all the theatres by owner
// since the get http method cannot take the req.body we are passing the userId as a path param
router.get("/getAllTheatresByOwner/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const theatres = await dbTheatres.find({owner: userId})
    res.send({
      success: true,
      message: "Theatres are fetched successfully",
      data: theatres,
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
router.get('/getAllTheatres', async(req, res) => {
  try {
    const theatres = await dbTheatres.find().populate('owner')
    res.send({
      success: true,
      message: 'All theatres fetched successfully',
      data: theatres
    })
  } catch (error) {
    res.send({
      success: false,
      message: 'Something went wrong',
      data: error
    })
  }
})

router.post('/getTheatreByMovie/', async(req, res)=>{
  try {
    const { date, movie } = req.body
    // get the shows based on the movie ID and the selected date
    const shows = await dbShows.find({movie, date}).populate('theatre')

    let uniqueTheatres = []
    shows.map((show)=>{
      // check if the theatre is already added to the unique list.
      const theatre = uniqueTheatres.find((theatre) => theatre._id === show.theatre._id)

      // if the theatre is not part of the unique list it means that this is a new theatre which needs to be added
      if(!theatre){
        // filter all the shows for the selected theatre to add them as shows related to that theatre. 
        const showsFortheatre = shows.filter((showObj) => showObj.theatre._id === show.theatre._id)

        // push the selected theatre along with its related shows.
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsFortheatre
        })
      }
  })

    res.send({
      success: true,
      message: "Theates and Shows fetched successfully",
      data: uniqueTheatres
    })
    
  } catch (error) {
    res.send({
      success: false,
      message: "Sonmething went wrong",
      data: error
    })
  }
})

router.post("/delete", async (req, res) => {
  try {
    await dbTheatres.findByIdAndDelete(req.body.theatreId);
    res.send({
      success: true,
      message: "Theatres deleted successfully",
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
    await dbTheatres.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({
      success: true,
      message: "Theatre is updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

exports.router = router;
