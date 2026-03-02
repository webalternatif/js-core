import {foreach} from "../traversal.js";

const methods = ['get', 'post', 'put', 'patch', 'head', 'delete'] as const

type HttpMethod = typeof methods[number]

type HttpMethods = {
    [K in HttpMethod]: (
        url: string,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ) => Promise<Response>
}

interface HttpCallable {
    (url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<Response>
}

type HttpInstance = HttpCallable & HttpMethods

interface RequestConfig {
    url: string
    method?: Uppercase<typeof methods[number]>
    headers?: Record<string, string>
    body?: any
}

function createHttpInstance(): HttpInstance {
    const request = (config: RequestConfig): Promise<Response> => {
        return fetch(config.url, {
            method: config.method ?? 'GET',
            headers: config.headers,
            body: config.body,
        })
    }

    const instance = function (url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}) {
        return request({ ...config, url, method: 'GET' })
    } as HttpInstance

    foreach(methods, (method) => {
        instance[method] = function (url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}) {
            return request({ ...config, url, method: method.toUpperCase() as Uppercase<HttpMethod> })
        }
    })

    return instance;
}

const http = createHttpInstance();

export default http;
