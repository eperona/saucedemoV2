/**
 * API Test Helpers
 * Utility functions for API testing
 */

import { APIRequestContext } from '@playwright/test';
import { API_CONFIG } from '../config/apiConfig';

export function createHeaders(contentType: string = 'application/json'): Record<string, string> {
    return {
        'Content-Type': contentType,
        'Accept': 'application/json',
    };
}

export function generatePetId(): number {
    return Date.now();
}

export function generateOrderId(): number {
    return Date.now();
}

export function createPetPayload(id: number, name: string, status: string = 'available') {
    return {
        id: id,
        name: name,
        category: {
            id: 1,
            name: 'Dogs'
        },
        photoUrls: [
            'https://example.com/photo1.jpg'
        ],
        tags: [
            {
                id: 1,
                name: 'tag1'
            }
        ],
        status: status
    };
}

export function createOrderPayload(id: number, petId: number, quantity: number = 1, status: string = 'placed') {
    return {
        id: id,
        petId: petId,
        quantity: quantity,
        shipDate: new Date().toISOString(),
        status: status,
        complete: true
    };
}

export function validatePetResponse(responseBody: any): boolean {
    return (
        responseBody.hasOwnProperty('id') &&
        responseBody.hasOwnProperty('name') &&
        responseBody.hasOwnProperty('status')
    );
}

export function validateOrderResponse(responseBody: any): boolean {
    return (
        responseBody.hasOwnProperty('id') &&
        responseBody.hasOwnProperty('petId') &&
        responseBody.hasOwnProperty('status')
    );
}

export async function deletePet(request: APIRequestContext, petId: number): Promise<void> {
    try {
        await request.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET_BY_ID(petId)}`, {
            headers: createHeaders(),
        });
    } catch (error) {
        // Ignore errors during cleanup
        console.log(`Cleanup: Failed to delete pet ${petId}`);
    }
}

export async function deleteOrder(request: APIRequestContext, orderId: number): Promise<void> {
    try {
        await request.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORE_ORDER_BY_ID(orderId)}`, {
            headers: createHeaders(),
        });
    } catch (error) {
        // Ignore errors during cleanup
        console.log(`Cleanup: Failed to delete order ${orderId}`);
    }
}
