
import axios from "axios";
import {useNavigate} from "react-router-dom"


// export const REACT_APP_KEYCLOAK_URL =`http://ec2-18-192-107-104.eu-central-1.compute.amazonaws.com:8080/auth/admin/realms/washroom`
// export const REACT_APP_HELIX_SERVER_URL="http://ec2-18-192-107-104.eu-central-1.compute.amazonaws.com:8081/api"


const keycloakApi = axios.create({
    baseURL:process.env.REACT_APP_KEYCLOAK_URL,
});

keycloakApi.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return request;
});
keycloakApi.interceptors.response.use(undefined, (error) => {
    // Errors handling
    if (error.status === 401) {
      localStorage.removeItem("accessToken")
      const navigate = useNavigate()
      navigate("/login")
    }
  });

export default keycloakApi