import axios from "axios";

export default axios.create({
    baseURL: "http://172.18.12.116:6969/api/",
    headers: {
        "Content-type": "application/json"
    }
});
