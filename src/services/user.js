import axios from "axios";

function handleAxiosError(
  error,
  fallbackMessage = "Network error or server not responding"
) {
  return (
    error?.response?.data || {
      success: false,
      message: fallbackMessage,
    }
  );
}

async function createAccount(formData, loginPayload) {
  try {
    const result = await axios.post(
      "https://blog-app-server-2f1h.onrender.com/api/v1/users/signup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (result?.data?.success) {
      return loginUser(loginPayload);
    }

    return {
      success: false,
      message: "Unknown error occurred while creating the account",
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

async function loginUser(data) {
  try {
    const result = await axios.post(
      "https://blog-app-server-2f1h.onrender.com/api/v1/users/login",
      data,
      {
        withCredentials: true,
      }
    );

    if (result?.data?.success) {
      console.log(result.data);
      return result.data;
    }

    return {
      success: false,
      message: "Unknown error occurred while login into account",
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

async function logoutUser() {
  try {
    const result = await axios.post(
      "https://blog-app-server-2f1h.onrender.com/api/v1/users/logout",
      {},
      {
        withCredentials: true,
      }
    );
    if (result?.data?.success) {
      return result.data;
    }

    return {
      success: false,
      message: "Unknown error occured while logging out",
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

async function getUser() {
  try {
    const response = await axios.get(
      "https://blog-app-server-2f1h.onrender.com/api/v1/users/profile",
      { withCredentials: true }
    );

    if (response?.data?.success) {
      return response.data;
    }

    return {
      success: false,
      message: "Unknown error occurred while fetching user profile",
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://blog-app-server-2f1h.onrender.com/api/v1/users/refresh-access",
      {},
      { withCredentials: true }
    );

    if(response?.data?.success){
      return response.data
    }

    return {
      success: false,
      message: "Unknown error occurred while refreshing the token"
    }

  } catch (error) {
     return handleAxiosError(error)
  }
}

export { createAccount, loginUser, logoutUser, getUser, refreshAccessToken };
