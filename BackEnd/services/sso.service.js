const axios = require("axios");

exports.getSSOPayload = async (token) => {
  try {
    const response = await axios.post(
      `${process.env.YUKTI_SERVICE_PATH}/auth/token/reads`,
      {}, // Empty body (remove if API doesn't expect POST body)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Service-Key": process.env.YUKTI_SERVICE_NAME,
        },
        timeout: 10000, // Optional: 10 seconds timeout
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "SSO Validation Error:",
      error.response?.data || error.message,
    );

    throw new Error("Unable to validate SSO token");
  }
};

exports.logoutSSO = async (ssoToken) => {
  try {
    const response = await axios.post(
      `${process.env.YUKTI_SERVICE_PATH}/auth/logoutApp`,
      {
        include: true,
      },
      {
        headers: {
          Authorization: `Bearer ${ssoToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("SSO Logout Error:", error.response?.data || error.message);

    return null;
  }
};

exports.validateSSOSession = async (ssoToken) => {
  try {
    const response = await axios.get(
      `${process.env.YUKTI_SERVICE_PATH}/service/${process.env.YUKTI_SERVICE_NAME}/data`,
      {
        headers: {
          Authorization: `Bearer ${ssoToken}`,
        },
        timeout: 5000,
      },
    );
    console.log("SSO Validation Response:", response.data);

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("SSO Validation Error:", err.response.data);
      return err.response.data;
    }

    throw err;
  }
};
