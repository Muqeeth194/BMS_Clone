import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";

const TheatreShows = ({ theatre }) => {
  console.log(theatre);
    const navigate = useNavigate()


  return (
    <div style={{ borderTop: "1px solid #ccc", padding: "10px" }}>
      <h2 style={{ paddingBottom: "5px" }}>THEATRES</h2>
      <div>
        {theatre.map((theatre) => (
          <div
            key={theatre._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "5px",
            }}
          >
            <h2>{theatre.name}</h2>
            <h4>{theatre.address}</h4>

            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px",
                display: "flex",
              }}
            >
              {theatre.shows
                .sort(
                  (a, b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                )
                .map((show) => (
                  <div
                    key={show._id}
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      margin: "5px",
                      transition: "background-color 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {e.target.style.backgroundColor = "tomato"; e.target.style.color = "white"}}
                    onMouseLeave={(e) => {e.target.style.backgroundColor = "transparent"; e.target.style.color = "#000"}}

                    onClick={()=>{
                        navigate(`/book-show/${show._id}`)
                    }}
                  >
                    {show.time}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreShows;
