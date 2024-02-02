import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Showloading, HideLoading } from "../redux/loadersSlice";
import { GetCurrentUser } from "../apicalls/users";
import { setUser } from "../redux/userSlice";
import { message } from "antd";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users).user;
  // const loading = useSelector((state) => state.loaders.loading);



  const getCurrentUser = async () => {
    try {
      // show loader
      dispatch(Showloading());
      // make the API call to get the user if the token is valid
      const response = await GetCurrentUser();
      // hide loader
      dispatch(HideLoading());
      if (response.success) {
        // update the user reducer
        dispatch(setUser(response.data));
      } else {
        // update the user reducer with null
        dispatch(setUser(null));
        // show the message with the error
        message.error(response.message);
        // remove the invalid token from the
        localStorage.removeItem("token");
        // redirect to login page
        navigate("/login");
      }
    } catch (error) {
      // hide the loader
      dispatch(HideLoading());
      // update the user reducer with null
      dispatch(setUser(null));
      // show error
      message.error(error);
      // redirect to login page
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getCurrentUser();
    }
  }, []);

  return (
    // <div className="layout p-1">
    //   {loading ? (
    //     <Loader />
    //   ) : (
        user && (
          <div className="layout p-1">
            <div className="header bg-primary flex justify-between p-2">
              <div>
                <h1
                  className="text-2xl text-white cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Book My Show
                </h1>
              </div>

              <div className="bg-white p-1 flex gap-1 ">
                <i className="ri-shield-user-line text-primary mt-1 cursor-pointer"></i>
                <h1
                  className="text-sm underline"
                    onClick={() => {
                      if (user.isAdmin) {
                        navigate("/admin");
                      } else {
                        navigate("/profile");
                      }
                    }}
                >
                  {user.name.toUpperCase()}
                </h1>

                <i
                  className="ri-logout-box-r-line mt-1 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                ></i>
              </div>
            </div>
            <div className="content mt-1 p-1">{children}</div>
          </div>
        )
      )}
//     </div>
//   );
// };

export default ProtectedRoute;
