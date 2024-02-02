import { axiosInstance } from ".";

export const MakePayment = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/bookings/make-payment",payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const BookShow = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/bookings/book-show",payload);
      return response.data;
    } catch (error) {
      return error;
    }
  }; 

export const GetBookingDetails = async (userId) => {
    try {
      const response = await axiosInstance.post("/api/bookings/bookingDetails", userId);
      return response.data;
    } catch (error) {
      return error;
    }
  }; 