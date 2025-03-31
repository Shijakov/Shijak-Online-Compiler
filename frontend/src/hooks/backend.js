import { useCallback, useState } from 'react';
import axios from '../config/axios';

export const STATUS_OK = 'OK';
export const STATUS_ERROR = 'ERROR';

export const useBackend = () => {
    const [loading, setLoading] = useState(true);

    const ok = (data) => {
        return {
            status: STATUS_OK,
            data,
        };
    };

    const fail = (data) => {
        return {
            status: STATUS_ERROR,
            data,
        };
    };

    const call = useCallback(async (endpoint, method = 'GET', body = null) => {
        try {
            setLoading(true);

            const headers = { 'Content-Type': 'application/json' };

            console.log(axios.defaults.baseURL);

            const response = await axios({
                url: endpoint,
                method,
                data: body,
                headers,
            });

            console.log(response.url);

            if (Math.floor(response.status / 100) !== 2) {
                return fail(response.data);
            }
            return ok(response.data);
        } catch (err) {
            let message;

            if (err.message) {
                message = err.message;
            }
            if (err.response) {
                message = err.response.data.message;
            }

            return fail(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { call, loading };
};
