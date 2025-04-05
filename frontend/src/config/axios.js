import Axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
// const apiPort = process.env.REACT_APP_API_PORT;

console.log(apiUrl)
// console.log(apiPort)

const axios = Axios.create({
    baseURL: `${apiUrl}/api`,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axios;
