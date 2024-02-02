import React, { useEffect, useState } from "react";
import { message, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, Showloading } from "../redux/loadersSlice";
import { GetAllMovies, DeleteMovie } from "../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const getData = async () => {
    try {
      dispatch(Showloading());
      const response = await GetAllMovies();
      dispatch(HideLoading());

      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search the movie"
        className="search-input"
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      ></input>

      <Row gutter={[20]} className="mt-2">
        {movies &&
          movies
            .filter((movie) =>
              movie.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((movie) => (
              <Col span={6}>
                <div className="card flex flex-col gap-1 cursor-pointer"
                  onClick={()=>{
                    navigate(
                      `/movie/${movie._id}?date=${moment().format('YYYY-MM-DD')}`
                    )
                  }}
                >
                  <img src={movie.poster} alt="" height={200} />
                  <div className="flex justify-center p-1">
                    <h1 className="text-md uppercase">{movie.title}</h1>
                  </div>
                </div>
              </Col>
            ))}
      </Row>
    </div>
  );
};

export default Home;
