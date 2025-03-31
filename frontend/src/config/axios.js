import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axios;
