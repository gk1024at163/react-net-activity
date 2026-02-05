import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5001/api'
});

//响应拦截器
agent.interceptors.response.use(
    async response => {
        await sleep(2000);
        store.uiStore.setIdle();
        return response;
    },
    async error => {
        await sleep(2000);
        store.uiStore.setIdle();
        const { status, data } = error.response;
        switch (status) {
            case 400:
                if (data.errors) {//验证错误，errors中有错误信息
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();//抛出一个扁平化的错误数组
                } else {//真的是400错误
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Unauthorised');
                break;
            case 404:
                router.navigate('/not-found');
                break;
            case 500:
                router.navigate('/server-error', { state: { error: data } });
                break;
            default:
                break;
        }
        return Promise.reject(error);
    }
);

//请求拦截器
agent.interceptors.request.use(config => {
    store.uiStore.setBusy();
    return config;
});

export default agent;

