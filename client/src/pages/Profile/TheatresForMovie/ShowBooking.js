import React, { useEffect, useState } from "react";
import { GetShowById } from "../../../apicalls/shows";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, Showloading } from "../../../redux/loadersSlice";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Button from "../../../components/Button";
import { BookShow, MakePayment } from "../../../apicalls/bookings";

const ShowBooking = () => {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate()

  const getData = async () => {
    const showId = params.showId;
    try {
      dispatch(Showloading());
      const response = await GetShowById(showId);
      dispatch(HideLoading());

      if (response.success) {
        console.log(response);
        setShow(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const book = async (transactionId) => {
    const showId = params.showId;
    try {
      dispatch(Showloading());
      const response = await BookShow({
        show: show._id,
        user: user._id,
        seats: selectedSeats,
        transactionId
      });
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message)
        console.log(response);
        navigate('/profile')
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleToken = async (token) => {
    try {
      dispatch(Showloading());
      const response = await MakePayment({
        token,
        amount: selectedSeats.length * show.ticketPrice,
      });
      dispatch(HideLoading());

      if (response.success) {
        console.log(response);
        message.success(response.message)
        // book the show
        book(response.data)
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getSeats = () => {
    const columns = 12;
    const totalSeats = show.totalSeats; // 120
    const rows = Math.ceil(totalSeats / columns); // 10

    return (
      <div>
        <p className="m-4">Screen This Side</p>
        <hr />
        <div className="flex gap-1 flex-col p-2 card">
          <hr />

          {Array.from(Array(rows).keys()).map((seat, index) => {
            return (
              <div className="flex gap-1 justify-center">
                {/* 0,  1 ,2, ,3, ..        11 
             0 [ [ 0, 1, 2, 3, 4, 5,6,7.. ,11],
             1   [0,  1, 2, 3, ..        ,11],
             2  .
                .
             9   [0,1,2           , .... 11]
              ] */}
                {Array.from(Array(columns).keys()).map((column, index) => {
                  const seatNumber = seat * columns + column + 1;
                  // 12*1 + 3+ 1 = 16
                  let seatClass = "seat";
                  // seat = 0 // coloumns = 12
                  //0 + 1 + 1 = 2
                  if (selectedSeats.includes(seat * columns + column + 1)) {
                    seatClass = seatClass + " selected-seat";
                  }
                  if (show.bookedSeats.includes(seat * columns + column + 1)) {
                    seatClass = seatClass + " booked-seat";
                  }
                  return (
                    seat * columns + column + 1 <= totalSeats && (
                      <div
                        className={seatClass}
                        onClick={() => {
                          if (selectedSeats.includes(seatNumber)) {
                            setSelectedSeats(
                              selectedSeats.filter(
                                (item) => item !== seatNumber
                              )
                            );
                          } else {
                            setSelectedSeats([...selectedSeats, seatNumber]);
                          }
                        }}
                      >
                        <h1 className="text-sm">
                          {seat * columns + column + 1}
                        </h1>
                      </div>
                    )
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {show && (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
            }}
          >
            <div style={{ marginLeft: "20px", textTransform: "uppercase" }}>
              <h2>{show.theatre.name}</h2>
            </div>

            <div style={{ margin: "auto", textTransform: "uppercase" }}>
              <h2>
                {show.movie.title} ({show.movie.language})
              </h2>
            </div>

            <div style={{ marginLeft: "auto", fontSize: "14px" }}>
              <h2>
                {moment(show.date).format("MMM Do yyyy")}
                {"  "}
                {moment(show.time, "HH:mm").format("hh:mm A")}
              </h2>
            </div>
          </div>

          <div>{getSeats()}</div>
          {selectedSeats.length > 0 && (
            <div className="mt-2 flex justify-center gap-2 items-center flex-col">
              <div className="flex justify-center">
                <div className="flex uppercase card p-2 gap-3">
                  <h1 className="text-sm">
                    <b>Selected Seats</b> : {selectedSeats.join(" , ")}
                  </h1>

                  <h1 className="text-sm">
                    <b>Total Price</b> :{" "}
                    {selectedSeats.length * show.ticketPrice}
                  </h1>
                </div>
              </div>

              <StripeCheckout

                // stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY} // Replace with your actual public key
                stripeKey="pk_test_51OevE2SJGqrkLLdsT9Txz0v70PngghxJP1t3vxb08BY8bYBhCwEQahiZF0dl5hBTcd4nAbmuGj37Plh64bK5yUTS00vyck1oWC"
                token={handleToken}
                amount={selectedSeats.length * show.ticketPrice}
                // billingAddress
                name="Book My Show Clone"
              >
                <Button title="Book Now" />
              </StripeCheckout>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowBooking;
