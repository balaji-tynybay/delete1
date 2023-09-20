// import axios from "axios";
const axios = require("axios");



const funStart = ()=> {
    
const url = 'https://25a7-103-125-162-42.ngrok-free.app/api/sensor_data/dmrData?startDate=2023-05-02&endDate=2023-04-27&type=getWaterTankValues';




// Set the access token

const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKcWltc2JMVnowOXJFNVVwcXF4SUVmN0dKYmVwRFdSbU9rRm1kZ2NBbDlZIn0.eyJleHAiOjE2ODM1OTA2MTAsImlhdCI6MTY4MzU1NDYxMCwianRpIjoiNWRmMWYwNDktNzQ0My00M2FmLTk1ZjUtODRhY2FiOTYwNjlhIiwiaXNzIjoiaHR0cDovLzEzLjIxMy4yMDEuMTg2OjgwODAvYXV0aC9yZWFsbXMvd2FzaHJvb20iLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiZDQ3M2QyYzYtOTk1Yy00OTc4LWFkNWEtNGYwMDY3OWJhZjE3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicmVhY3QtYXBwIiwic2Vzc2lvbl9zdGF0ZSI6IjU4ZWVkZjhkLTkzZjktNDEzYi1iNTg0LWYyNDNhMmM2Mzc2MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDEwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJEb3dubG9hZCBJRkMiLCJEb3dubG9hZCBDb2JpZSIsIlZpZXcgSUZDIiwiRGVsZXRlIFVzZXIiLCJWaWV3IFNlbnNvciBMaXN0IiwiRG93bmxvYWQgQ2VydGlmaWNhdGVzIiwiRG93bmxvYWQgUmVwb3J0cyIsIkVkaXQgU2Vuc29yIiwiRGVsZXRlIFN1YiBDdXN0b21lciIsImRlZmF1bHQtcm9sZXMtd2FzaHJvb20iLCJBZGQgTG9nbyIsIkFkZCBJRkMiLCJEZWxldGUgU3ViIFVzZXIiLCJBZGQgR2F0ZXdheSIsIkRlbGV0ZSBTZW5zb3IiLCJDcmVhdGUgQ3VzdG9tZXIiLCJWaWV3IERhc2hib2FyZCIsIm9mZmxpbmVfYWNjZXNzIiwiRGVsZXRlIEN1c3RvbWVyIiwiQWRkIFNlbnNvciIsInVtYV9hdXRob3JpemF0aW9uIiwiRmlybXdhcmUgVXBkYXRlIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzaWQiOiI1OGVlZGY4ZC05M2Y5LTQxM2ItYjU4NC1mMjQzYTJjNjM3NjEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiaGVsaXgiLCJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJncm91cCI6WyIvQWRtaW4iXX0.YVySCDnSg1SGhpnolItYH6LHI36plWul4Uz1ufSj3yvIM4v4jZFzbQxQ13n9_rM8pLJdsMaj3puUuMHB2bPaPpx2Uc3B6Wz62zu_elusO_cPxAjmeAzp0IuHXaxY9BOXS3HJ2wKW-LdCW7Vwig2JmGCh5CqmWNpsOdsk_CO8hJXH84pk-qXcUjSeE-8Bm3i2ETEP4KSJ-t1W96MqAzxtxDQSBpm1e3EeTVYVV11wxjWFt-NLI1vrAp8v9_tUEcOFhcSUoo5UM5bvLurNYruQA2kZo5P9MvH_F4z6QMkcH-Jd0gzBWsdUj_Jqlb9sVlHG3B51zdRhS7qx_kWG72zv4g'



// Set the request headers

const headers = {

  'Authorization': `Bearer ${accessToken}`,

  'Content-Type': 'application/json'

};
    axios.get(url, {

            headers
        
          })
        
          .then(response => {
        
            console.log(response.data); // log the response data
        
          })
        
          .catch(error => {
        
            console.error(error); // log any errors
        
          });
}

funStart();


// import React from 'react'

// const api = () => {
//   return (
//     <div>api</div>
//   )
// }

// export default api