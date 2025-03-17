import axios from "axios"

const api = axios.create({
   
    // baseURL: "http://localhost:5000",
    baseURL:"https://chatapp-server-xfd9.onrender.com/"

});

api.interceptors.request.use(

    function (config) {

        return config;
    }

)
api.interceptors.request.use(

)
export default api;