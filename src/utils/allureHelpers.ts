import { APIResponse } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function attachApiRequest(
    method: string,
    url: string,
    headers?: Record<string, string>,
    body?: any
): Promise<void> {
    const requestDetails = `Method: ${method}\nURL: ${url}\n\nHeaders:\n${JSON.stringify(headers, null, 2)}${body ? `\n\nBody:\n${JSON.stringify(body, null, 2)}` : ''}`;
    
    await allure.attachment('API Request', requestDetails, 'text/plain');
}

export async function attachApiResponse(response: APIResponse): Promise<void> {
    let responseBody: any;
    try {
        responseBody = await response.json();
    } catch {
        responseBody = await response.text();
    }

    const responseHeaders = response.headers();
    const responseDetails = `Status: ${response.status()} ${response.statusText()}\n\nHeaders:\n${JSON.stringify(responseHeaders, null, 2)}\n\nBody:\n${JSON.stringify(responseBody, null, 2)}`;

    await allure.attachment('API Response', responseDetails, 'text/plain');
}

export async function attachApiCall(
    method: string,
    url: string,
    response: APIResponse,
    requestHeaders?: Record<string, string>,
    requestBody?: any
): Promise<void> {
    await attachApiRequest(method, url, requestHeaders, requestBody);
    await attachApiResponse(response);
}
