import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, Showloading } from "../../../redux/loadersSlice";
import { GetMovieById } from "../../../apicalls/movies";
import { GetTheatresByMovie } from "../../../apicalls/theatres";
import TheatreShows from "./TheatreShows";

const TheatresForMovie = () => {
  const [movie, setMovie] = useState();
  const [theatre, setTheatre] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    const movieId = params.movieId;
    try {
      dispatch(Showloading());
      const response = await GetMovieById(movieId);
      dispatch(HideLoading());

      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getTheatres = async () => {
    const movieId = params.movieId;
    try {
      dispatch(Showloading());
      const response = await GetTheatresByMovie({ date, movie: movieId });
      dispatch(HideLoading());

      if (response.success) {
        setTheatre(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getTheatres();
  }, []);

  useEffect(() => {
    getTheatres();
  }, [date]);

  return (
    <div>
      {movie && (
        <div>
          {/* movie information */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl uppercase">
                {movie.title} ({movie.language})
              </h1>
              <h1 className="text-md">Duration : {movie.duration} mins</h1>
              <h1 className="text-md">
                Release Date : {moment(movie.releaseDate).format("MMM Do yyyy")}
              </h1>
              <h1 className="text-md">Genre : {movie.genre}</h1>
            </div>
            <div>
              <h1 className="text-md">Select Date</h1>
              <input
                type="date"
                // min={moment().format("YYYY-MM-DD")}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  navigate(`/movie/${params.movieId}?date=${e.target.value}`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {
      theatre.length>0 && <TheatreShows theatre={theatre} />
      }

    </div>
  );
};

export default TheatresForMovie;
