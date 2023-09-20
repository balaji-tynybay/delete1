const axios = require("axios");

const callApi = async (header, access_token) => {
  try {
    const response = await axios.post(
      "https://api-demo-v3.helixsense.com/api/v4/isearch_read",
      header,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        timeout: 60000,
      }
    );

    return response.data; // Return the response data directly
  } catch (error) {
    console.error("API Call Error:", error);
    return { data: [] }; // Return an empty data object on error
  }
};

// const helixsensecallApi = async (header, access_token) => {
//   try {
//     const response = await axios.post(
//       "https://api-demo-v3.helixsense.com/api/v4/isearch_read",
//       header,
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//         timeout: 60000,
//       }
//     );

//     return response.data; // Return the response data directly
//   } catch (error) {
//     console.error("API Call Error:", error);
//     return { data: [] }; // Return an empty data object on error
//   }
// };

module.exports = {
  callApi,
  // helixsensecallApi
};
