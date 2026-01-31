export const API_CONFIG = {
    BASE_URL: 'https://petstore.swagger.io/v2',
    ENDPOINTS: {
        PET: '/pet',
        PET_BY_ID: (id: number) => `/pet/${id}`,
        PET_BY_STATUS: '/pet/findByStatus',
        STORE_INVENTORY: '/store/inventory',
        STORE_ORDER: '/store/order',
        STORE_ORDER_BY_ID: (id: number) => `/store/order/${id}`,
    },
    TIMEOUT: 30000,
} as const;

export const PET_STATUS = {
    AVAILABLE: 'available',
    PENDING: 'pending',
    SOLD: 'sold',
} as const;

export const ORDER_STATUS = {
    PLACED: 'placed',
    APPROVED: 'approved',
    DELIVERED: 'delivered',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
} as const;
