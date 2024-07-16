export interface ApiResponse<T> {
    code: number;
    status: string;
    data: T | null;
}

export function handleResponse<T>(statusCode: number, statusText: string, data?: T): ApiResponse<T> {
    return {
        code: statusCode,
        status: statusText,
        data: data || null
    };
}

export const internalServerError = {
    code: 500,
    status: "Internal Server Error",
    data: null
}