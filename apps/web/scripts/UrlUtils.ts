import axiosInit from "./AxiosInit";

class URLUtils {
    static async get (endpoint:string, params = {}) {
        return await axiosInit.get(endpoint, { params, withCredentials: true });
    }

    static async post (endpoint:string, data={}, options={}) {
        return await axiosInit.post(endpoint, data, {...options, withCredentials: true});
    }

    static async upload (endpoint:string, data = {}) {
        return await axiosInit.post(endpoint, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async download (endpoint:string, data = {}, setProgress : any) {
        return await axiosInit.post(endpoint, data, {
            responseType: 'blob',
            withCredentials: true,
             timeout: 120000,
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentage);
                }
            },
        });
    }

    static async api (data:string) {
        return await axiosInit.get(data, {withCredentials:false});
    }
}

export default URLUtils;
