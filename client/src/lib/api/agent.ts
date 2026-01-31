import axios from "axios";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5001/api'
});

//响应拦截器
agent.interceptors.response.use(async response => {
    try {
        await sleep(2000);
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    } finally {
        store.uiStore.setIdle();
    }
});

//请求拦截器
agent.interceptors.request.use(config => {
    store.uiStore.setBusy();
    return config;
});

export default agent;

