import axios, { AxiosInstance } from 'axios';
import { env } from '../../config/env'; 

export const strapiClient: AxiosInstance = axios.create({
  baseURL: env.STRAPI_API_URL,
  headers: {
    Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});