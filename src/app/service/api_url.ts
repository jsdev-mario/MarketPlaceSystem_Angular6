import Constant from './constant';
export default {
    POSTCODE_GETDATA_URL: 'http://api.postcodes.io/postcodes/',
    POSTCODE_VALIDATE_URL: 'http://api.postcodes.io/postcodes/',

    SITE_INFO_GET: `${Constant.SERVER_URL}/site_info/get`,
    BUTCHER_SEARCH: `${Constant.SERVER_URL}/share/butchers`,
    SHOP_MENU_GET: `${Constant.SERVER_URL}/share/shop_menu`,
    LOCATION_NEAREST_ADDRESS: `${Constant.SERVER_URL}/share/nearest_addresses`,
    ADDRESS_TO_LOCATION: `${Constant.SERVER_URL}/share/getlocation`,


    CATEGORY_GET: `${Constant.SERVER_URL}/category/get`,
    SUBCATEGORY_GET: `${Constant.SERVER_URL}/subcategory/get`,
    CHOICE_GET: `${Constant.SERVER_URL}/choice/get`,

    MENUS_GET: `${Constant.SERVER_URL}/menu/get`,
    ORDER_ADD: `${Constant.SERVER_URL}/order/add`,
    BUT_ORDERINFO_GET: `${Constant.SERVER_URL}/order/get_butordersinfo`,
    BUT_ORDER_GET: `${Constant.SERVER_URL}/order/get_butorder`,

    CUST_ORDERINFO_GET: `${Constant.SERVER_URL}/order/get_custordersinfo`,
    CUST_ORDER_GET: `${Constant.SERVER_URL}/order/get_custorder`,

    CUSTOMER_SIGNIN: `${Constant.SERVER_URL}/customer/signin`,
    CUSTOMER_SIGNUP: `${Constant.SERVER_URL}/customer/signup`,
    UPLOAD_CUSTOMERFILE: `${Constant.SERVER_URL}/customer/upload_file`,
    CUSTOMER_UPDATE_PROFILE: `${Constant.SERVER_URL}/customer/update_profile`,
    CUSTOMER_FORGOTPASS: `${Constant.SERVER_URL}/customer/forgot_password`,
    CUSTOMER_CHANGEPASS: `${Constant.SERVER_URL}/customer/change_password`,
    CUSTOMER_DELADDRESS_ADD: `${Constant.SERVER_URL}/customer/add_delivery_address`,
    CUSTOMER_DELADDRESS_UPDATE: `${Constant.SERVER_URL}/customer/update_delivery_address`,
    CUSTOMER_DELADDRESS_REMOVE: `${Constant.SERVER_URL}/customer/remove_delivery_address`,
    CUSTOMER_DELETE_ACCOUNT: `${Constant.SERVER_URL}/customer/delete_account`,

    BUTHCER_SIGNIN: `${Constant.SERVER_URL}/butcher/signin`,
    BUTCHER_SIGNUP: `${Constant.SERVER_URL}/butcher/signup`,
    UPLOAD_BUTCHERFILE: `${Constant.SERVER_URL}/butcher/upload_file`,
    BUTCHER_UPDATE_PROFILE: `${Constant.SERVER_URL}/butcher/update_profile`,
    BUTCHER_FORGOTPASS: `${Constant.SERVER_URL}/butcher/forgot_password`,
    BUTCHER_CHANGEPASS: `${Constant.SERVER_URL}/butcher/change_password`,

    SHOP_UPDATE: `${Constant.SERVER_URL}/shop/update`,
    BUTHCER_SHOPMENU_UPDATE: `${Constant.SERVER_URL}/shop/update_menu`,
    CONTACTUS_ADD: `${Constant.SERVER_URL}/contactus/add`,

    SHOP_MENU_UPDATE: `${Constant.SERVER_URL}/shop_menu/update`,

    PAYMENT_GETACCESS_TOKEN: `${Constant.SERVER_URL}/payment/get_access_token`,
    PAYMENT_GET_CLIENT_TOKEN: `${Constant.SERVER_URL}/payment/client_token`,
    PAYMENT_CHECK_OUT_PAYPAL: `${Constant.SERVER_URL}/payment/check_out_paypal`,
    PAYMENT_CHECK_OUT_CARD: `${Constant.SERVER_URL}/payment/check_out_card`,



    ORDER_UPDATE_STATUS: `${Constant.SERVER_URL}/order/update_status`,
    ORDER_RATTING: `${Constant.SERVER_URL}/order/rating`,
    ORDER_REFUND_REQUEST: `${Constant.SERVER_URL}/order/refund_request`,


    SSE_BUTORDERS_INFO: `${Constant.SERVER_URL}/sse/addbutorders`,
};
