import axios from "axios";

export const apiActions = axios.create({
    baseURL: 'https://www.okanebox.com.br/api/acoes/ultima/'
})