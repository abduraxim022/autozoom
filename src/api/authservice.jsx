import { toast } from "react-toastify";
import api from "./axiosconfig";

export const login = async (username, password) => {
  try {
    const response = await api.post("auth/signin", {
      phone_number: username,
      password: password,
    });
    const token = response?.data?.data?.tokens?.accessToken?.token;
    const message = response?.data?.message


    if (token) {
      localStorage.setItem("authToken", token);
      return { token: `Bearer ${token}`, message };
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    throw error.response?.data?.message || "An error occurred during login.";
  }
};
