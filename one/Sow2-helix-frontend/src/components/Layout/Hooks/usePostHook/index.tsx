import React from 'react'
// import { accessToken } from "../../Dashboard/token";
import axios from 'axios';

const usePostHooks = (data: any) => {

  const accessToken = localStorage.getItem("accessToken");
    axios.post(
        "http://localhost:8081/api/sensor_data/triggerSetting?type=htGrid",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      console.log("--------------------------------", data)

  return {data}
  
}

export default usePostHooks;




// export const postHtGridData = async (triggersData: any) => {
//     try {
//       const response = await axios.post("http://localhost:8081/api/sensor_data/triggerSetting?type=htGrid", { triggersData });
//       return response.data;
//     } catch (error) {
      
//     }
//   };