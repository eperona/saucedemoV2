/**
 * Pet API Tests
 * Core Requirement: API 1 - POST /pet (Create Pet)
 * Test Count: 3 tests
 * HTTP Method: POST
 */

import { test, expect } from '@playwright/test';
import { API_CONFIG, PET_STATUS, HTTP_STATUS } from '../../config/apiConfig';
import {
    createHeaders,
    generatePetId,
    createPetPayload,
    validatePetResponse,
    deletePet
} from '../../utils/apiHelpers';
import { attachApiCall } from '../../utils/allureHelpers';

test.describe('Pet API Tests - POST /pet (Create Pet)', () => {
    let petId: number;

    test.beforeEach(() => {
        petId = generatePetId();
    });

    test.afterEach(async ({ request }) => {
        await deletePet(request, petId);
    });

    test('should successfully create a new pet with valid data', async ({ request }) => {
        const petData = createPetPayload(petId, 'Buddy', PET_STATUS.AVAILABLE);
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET}`;
        const headers = createHeaders();

        const response = await request.post(url, {
            headers: headers,
            data: petData,
        });

        await attachApiCall('POST', url, response, headers, petData);

        expect(response.status()).toBe(HTTP_STATUS.OK);
        const responseBody = await response.json();

        expect(validatePetResponse(responseBody)).toBeTruthy();
        expect(responseBody.id).toBe(petId);
        expect(responseBody.name).toBe('Buddy');
        expect(responseBody.status).toBe(PET_STATUS.AVAILABLE);
    });

    test('should create pet with different status values', async ({ request }) => {
        const petData = createPetPayload(petId, 'Max', PET_STATUS.PENDING);
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET}`;
        const headers = createHeaders();

        const response = await request.post(url, {
            headers: headers,
            data: petData,
        });

        await attachApiCall('POST', url, response, headers, petData);

        expect(response.status()).toBe(HTTP_STATUS.OK);
        const responseBody = await response.json();

        expect(responseBody.status).toBe(PET_STATUS.PENDING);
        expect(responseBody.name).toBe('Max');
    });

    test('should create pet with minimal required fields', async ({ request }) => {
        const minimalPetData = {
            id: petId,
            name: 'MinimalPet',
            photoUrls: ['https://example.com/photo.jpg']
        };
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET}`;
        const headers = createHeaders();

        const response = await request.post(url, {
            headers: headers,
            data: minimalPetData,
        });

        await attachApiCall('POST', url, response, headers, minimalPetData);

        expect(response.status()).toBe(HTTP_STATUS.OK);
        const responseBody = await response.json();

        expect(responseBody.id).toBe(petId);
        expect(responseBody.name).toBe('MinimalPet');
    });
});
