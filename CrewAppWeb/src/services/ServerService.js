// ServerService.js
import axios from 'axios';
import { getToken } from "../helpers/store";
import { format } from 'date-fns';

const _baseApi = process.env.REACT_APP_BASE_API;

class ServerService {
    static async getJobs(start, end, crew) {
    
        // Format dates as 'YYYY-MM-DD' for query parameters
        const startDate = format(start, 'yyyy-MM-dd');
        const endDate = format(end, 'yyyy-MM-dd');


        const url = `${_baseApi}/schedules/jobs/?start_date=${startDate}&end_date=${endDate}&crew=${crew}`;

        try {
        const response = await axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${getToken()}`
            }
        });

        return { hasError: false, data: response.data };
        } catch (error) {
        console.error("Error fetching jobs:", error.response?.data?.detail || "Something went wrong");
        return {
            hasError: true,
            data: error.response?.data?.detail || "Something went wrong"
        };
        }
    }

    static async fetchCrews() {
    
        const url = `${_baseApi}/users/crew/`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${getToken()}`
                }
            });
            return { hasError: false, data: response.data };
        } catch (error) {
            console.error("Error fetching crews:", error.response?.data?.detail || "Something went wrong");
            return {
                hasError: true,
                data: error.response?.data?.detail || "Something went wrong"
            };
        }
    }
}

export default ServerService;