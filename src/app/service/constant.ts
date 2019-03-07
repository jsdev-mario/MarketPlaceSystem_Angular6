export default {
    SERVER_URL: 'http://xxxx.xxx',
    // SERVER_URL: '/apis',
    SITE_NAME: 'Meat Hut',
    userType: {
        CUSTOMER: 0,
        BUTCHER: 1,
        ADMIN: 2,
    },
    userRole: {
        customer: {
            CUSTOMER: 0
        },
        butchers: {
            MANAGER: 0,
            DRIVER: 1
        },
        admin: {
            ADMIN: 0,
        }
    },
    titles_label: ['Mr', 'Mrs', 'Miss', 'Ms', 'Prefer not say'],
    titles: ['Mr', 'Mrs', 'Miss', 'Ms', ''],
    deliveryType: {
        COLLECTION: 0,
        DELIVERY: 1,
    },
    secret: 'meathut',
    orderStatus: {
        AWAITING_CONFIRMATION: 0,
        CONFIRMED_PREPARING: 1,
        READY_COLLECTION: 2,
        OUT_DELIVERY: 3,
        COLLECTED: 4,
        DELIVERED: 5,
        NOT_COLLECTED: 6,
        NOT_DELIVERY_WRONGADDRESS: 7,
        CANCELLED_BYCUST: 8,
        REJECTED_BYBUT: 9,
        REFUND_REQUEST: 10,
        REFUND_PROCESSED: 11,
    },
    sseEventNames: {
        ADD_BUTORDERS: 'addbutorders'
    },
    eventNames: {
        BUTORDERHIS_REFRESH: 'butorderhis_refresh',
        BUTBADGE_CLEAR: 'butbadge_clear',
        HEADER_STYLE: 'header_style',
        SETORDER_TO_HEADER: 'orderset_to_orderheader',
        UPDATE_ORDER_STATUS: 'update_order_status'
    },

    paymentMethod: {
        PAYPAL: 0,
        CARD: 1,
        CASH: 2,
    },
};

