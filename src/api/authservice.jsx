import api from "./axiosconfig";

export const login = async (username, password) => {
  try {
    const response = await api.post("auth/signin", {
      phone_number: username,
      password: password,
    });
    const token = response?.data?.data?.tokens?.accessToken?.token;

    if (token) {
      localStorage.setItem("authToken", token);

      return `Bearer ${token}`;
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    throw errorMessage;
  }
};
