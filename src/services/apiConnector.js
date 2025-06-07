// import axios from "axios";

// export const axiosInstance = axios.create({});

// export const apiConnector = (method, url, bodyData, headers, params) => {
//   return axiosInstance({
//     method: `${method}`,
//     url: `${url}`,
//     data: bodyData ? bodyData : null,
//     headers: headers ? headers : null,
//     params: params ? params : null,
//   });
// };


// import axios from "axios";
// // ✅ Define this BEFORE using it
// export const axiosInstance = axios.create({});
// // ✅ Use it correctly in apiConnector
// export const apiConnector = (method, url, bodyData = null, headers = {}, params = null) => {
//   const config = {
//     method,
//     url,
//     headers,
//     params,
//   };

//   // ✅ Only include data for methods that allow a body
//   if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) && bodyData) {
//     config.data = bodyData;
//   }

//   return axiosInstance(config);
// };


import axios from "axios";

export const axiosInstance = axios.create({
  // You can set a baseURL here if needed, e.g. baseURL: "https://api.example.com"
});

// A basic connector without auth header
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
  });
};

// Connector that automatically adds the Bearer token from localStorage (for protected APIs)
export const apiConnectorWithAuth = (method, url, bodyData = null, params = null) => {
  // Retrieve token from localStorage and parse it
  const token = JSON.parse(localStorage.getItem("token"));

  // If no token, throw error or handle accordingly (optional)
  if (!token) {
    throw new Error("No token found. Please login.");
  }

  // Set Authorization header
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return apiConnector(method, url, bodyData, headers, params);
};

