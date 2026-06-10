import axios from "axios";
import { useAccountsStore } from "@/state/useAccountsStore";

const axiosInit = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInit.interceptors.response.use(
    (response) => response,
    async (error) => {
        // wipe zustand store
        if (error.response?.data?.code === 'AUTH_ERROR') {
            useAccountsStore.getState().clearCustomer();
            window.location.href = '/user/login'; 
            return;
        }
        return Promise.reject(error);
    }
);

export default axiosInit;