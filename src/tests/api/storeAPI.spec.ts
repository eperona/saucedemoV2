/**
 * Store API Tests
 * Core Requirement: API 2 - DELETE /store/order/{orderId} (Delete Order)
 * Test Count: 2 tests
 * HTTP Method: DELETE
 */

import { test, expect } from '@playwright/test';
import { API_CONFIG, ORDER_STATUS, HTTP_STATUS } from '../../config/apiConfig';
import {
    createHeaders,
    generateOrderId,
    generatePetId,
    createOrderPayload,
    deleteOrder
} from '../../utils/apiHelpers';
import { attachApiCall } from '../../utils/allureHelpers';

test.describe('Store API Tests - DELETE /store/order/{orderId} (Delete Order)', () => {
    let orderId: number;
    let petId: number;

    test.beforeEach(() => {
        orderId = generateOrderId();
        petId = generatePetId();
    });

    test.afterEach(async ({ request }) => {
        await deleteOrder(request, orderId);
    });

    test('should successfully delete an existing order', async ({ request }) => {
        // First, create an order to delete
        const orderData = createOrderPayload(orderId, petId, 1, ORDER_STATUS.PLACED);
        await request.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORE_ORDER}`, {
            headers: createHeaders(),
            data: orderData,
        });

        // Delete the order
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORE_ORDER_BY_ID(orderId)}`;
        const headers = createHeaders();
        const deleteResponse = await request.delete(url, { headers: headers });

        await attachApiCall('DELETE', url, deleteResponse, headers);

        expect(deleteResponse.status()).toBe(HTTP_STATUS.OK);

        // Verify the order is actually deleted by attempting to GET it
        const getResponse = await request.get(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORE_ORDER_BY_ID(orderId)}`,
            {
                headers: createHeaders(),
            }
        );

        expect(getResponse.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('should return 404 when deleting non-existent order', async ({ request }) => {
        const nonExistentId = 999999999;
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORE_ORDER_BY_ID(nonExistentId)}`;
        const headers = createHeaders();

        const response = await request.delete(url, { headers: headers });

        await attachApiCall('DELETE', url, response, headers);

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });
});
