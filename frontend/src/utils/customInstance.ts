import Axios, { AxiosError, AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.NEXT_PUBLIC_APP1_URL, withCredentials: true });

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
    withCredentials: true,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
