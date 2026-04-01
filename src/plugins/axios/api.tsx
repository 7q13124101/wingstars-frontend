import type { AxiosInstance } from "axios";
import type { IBodyResponse, ICommomListQuery, IGetListResponse } from "../../common/interface";


interface IServiceOptions {
    baseURL?: string;
}

export class ApiService {
    client: AxiosInstance;
    baseUrl: string;

    constructor(params: IServiceOptions, client: AxiosInstance) {
        this.client = client;
        this.baseUrl = params.baseURL || '';
    }

    get detailUrl(): string {
        return this.baseUrl;
    }

    get createUrl(): string {
        return this.baseUrl;
    }

    get updateUrl(): string {
        return this.baseUrl;
    }

    get deleteUrl(): string {
        return this.baseUrl;
    }

    useClient(axios: AxiosInstance): void {
        this.client = axios;
    }

    _getList<T>(queryString: ICommomListQuery): Promise<IBodyResponse<IGetListResponse<T>>> {
        return this.client.get(this.baseUrl, { params: queryString });
    }

    _getDetail<T>(id: number | string): Promise<IBodyResponse<T>> {
        return this.client.get<IBodyResponse<T>, IBodyResponse<T>>(this.detailUrl + `/${id}`);
    }

    _create<T, U>(data: T): Promise<IBodyResponse<U>> {
        return this.client.post<IBodyResponse<U>, IBodyResponse<U>>(this.createUrl, data);
    }

    _update<T, U>(id: number | string, data: T): Promise<IBodyResponse<U>> {
        return this.client.put<IBodyResponse<U>, IBodyResponse<U>>(this.updateUrl + `/${id}`, data);
    }

    _delete<T>(id: number | string): Promise<IBodyResponse<T>> {
        return this.client.delete<IBodyResponse<T>, IBodyResponse<T>>(this.deleteUrl + `/${id}`);
    }
}