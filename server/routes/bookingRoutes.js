const router = require("express").Router();
const dbBookings = require("../model/bookingModel");
const dbShows = require("../model/showModel");
const authMiddleware = require("../middlewares/authMiddleware");
const stripe = require("stripe")(process.env.stripe_secret_key);

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "INR",
      // customer: customerId,
    });

    // console.log(paymentIntent);
    const transactionId = paymentIntent.client_secret;

    res.send({
      success: true,
      message: "Tickets booked successfully, Payment is done",
      data: transactionId,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong with payment",
      error: error,
    });
  }
});

router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    // console.log(req.body);
    const newBooking = new dbBookings(req.body);
    await newBooking.save();

    // update the bookedSeats property in the show Model
    const show = await dbShows.findById({ _id: req.body.show });
    console.log(show);

    await dbShows.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });

    res.send({
      success: true,
      message: "Show is booked successfully",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong with booking",
      error: error,
    });
  }
});

router.post("/bookingDetails", authMiddleware, async (req, res) => {
  try {
    const bookings = await dbBookings.find({ user: req.body.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    res.send({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong with booking details",
      error: error,
    });
  }
});

exports.router = router;
