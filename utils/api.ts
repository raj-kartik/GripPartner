export const BASE_URL = 'https://fitwithgrip.com/trainer/';
export const GET_BANNER_LIST = 'home-banner-list';
export const DEFAULT_URL = 'https://fitwithgrip.com/';
export const POST_ADD_TO_CART = 'shop/add-to-cart';
export const POST_ADD_TO_CART_LIST = 'shop/get-cart-items';
export const POST_APPLY_COUPON = 'shop/apply-coupon';
export const GET_COOUNTY_REGION_CODE = 'shop/get-regions';
export const POST_ADD_SHIPPING_ADDRESS = 'shop/add-billing-shipping';
export const POST_PLACE_ORDER = 'shop/place-order';
export const STORE_API = 'store-api/';
export const POST_SCAN_ADD_TO_CART = 'scan-and-add-to-cart';
export const GET_SHOP_SPECIAL_PRODUCT = 'shop/home-special-product';
export const GET_YOGA_PRODUCT = 'shop/home-yoga-mats';
export const GET_MEDITATION_PRODUCT = 'shop/home-meditation-mat-products';
export const GET_YOGA_MAT_BANNER = 'shop/home-yoga-banner';
export const POST_PRODUCT_LIST = 'shop/product-list';
export const POST_DELETE_ADD_TO_CART_ITEM = 'shop/delete-product-by-sku';
export const POST_SEARCH = 'api/search';
export const GET_SPECIAL_BANNER = 'shop/home-banner-after-special-product';


// studio
export const POST_ADD_STUDIO_FORM ="add-studio"
export const GET_STUDIO_LIST ="studio-list"
export const POST_DELETE_STUDIO = "delete-studio"

// LOGIN_VIDEO
export const LOGIN_VIDEO = 'home-video';

// ======== shop banner ========,
export const GET_YOGA_ACCESSORIES = 'shop/home-yoga-accessories';
export const GET_MEDITATION_BANNER = 'shop/home-meditation-gears';
export const GET_MASSAGE_BANNER = 'shop/home-massage-therapy';
export const GET_HOME_FITNESS = 'shop/home-fitness';
export const GET_SPORTS_BANNER = 'shop/home-sports-mats';

// ========= shop product
export const GET_YOGA_ACCESSORIES_PRODUCT =
  'shop/home-yoga-accessories-product';
export const GET_MEDITATION_PRODUCT_LIST = 'shop/home-meditation-gears-product';
export const GET_MASSAGE_PRODUCT = 'shop/home-massage-therapy-product';
export const GET_HOME_FITNESS_PRODUCT = 'shop/home-fitness-product';
export const GET_SPORTS_PRODUCT = 'shop/home-sports-mats-product';

// ORDER
export const GET_ORDER_STATUS = 'shop/get-customer-orders';
export const GET_ORDER_DETAILS = 'shop/fetch-order-details';
export const POST_CANCEL_ORDER = 'shop/cancel-order';

// STORE
export const GET_STORE_SHOP = 'store-api/order-list';
export const GET_STORE_ORDER_DETAILS = 'store-api/order-detail';
export const UPDATE_STORE_QUANTITY = 'store-api/update-cart-quantity';
export const DELETE_STORE_ITEM = 'store-api/delete-cart-item';

// INVOICE
export const ORDER_INVOICE = 'shop/fetch-invoices/';

// export const GOOGLE_LOCATION_KEY = 'AIzaSyCH_1ahy6xNmFxDxEk7Xr2V1n2RnhK96oU';
export const GOOGLE_LOCATION_KEY = 'AIzaSyAAMvO2UwddhG8a3Z-miopVUI1Q6VDWqZA';

// PAYMENT
export const PAYMENT_ID = 'GRIP0042095811400073';
export const stagingUrl = 'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=123_1';

// USER
export const GET_USER_DETAILS = 'user-detail';
export const POST_SIGNUP = 'signup';

// HOME
export const GET_HOME_COURSE = 'home-course-list';

// course
export const GET_COURSE_LIST = (lat: number, long: number, list: string) => {
  return `${list}?latitude=${lat}&longitude=${long}`;
};

export const POST_COURSE_LEAD_CHANGE = 'update-lead-status';

// SECRET KEYS
export const ONE_SIGNAL_SECRET_KEY = 'a950326e-0037-4cb7-8583-ce8392a8ab43';
export const RAZORPAY_SECRET_KEY = 'rzp_live_5VC3pVIlFuAnB3';
export const GENERATE_RAZORPAY_ORDER_ID = 'shop/create-razorpay-order';

// REFERRAL CODE
export const GET_REFFERAL_CODE = 'my-referral-code';
export const GET_REFERRAL_LIST = 'referral-list';

// WALLET
export const GET_WALLET_BALANCE = 'wallet-balance';

// bank Account
export const POST_ADD_BANK = 'add-bank-account';
export const GET_BANK_LIST = 'bank-account-list';

// transaction
export const GET_TRANSAXTION = 'transaction-history';
export const POST_WITHDRAW_REQUEST = 'request-settlement';
export const POST_WALLET_IN_STORE = 'store-api/redeem-reward';
export const POST_ADD_WALLET = 'add-online-payment';
export const AGORA_APP_KEY = '518be2a3c5ee4c0da1bbd3f99b15809c';

// course
export const POST_PAY_COURSE_FEE = 'pay-for-course';
export const POST_UNSUBSCRIBE_COURSE = 'subscription-end';

// retreat
export const POST_PAY_RETREAT_FEE = 'pay-for-retreat';
export const POST_RETREAT_LEAD_CHANGE = 'user-retreat-lead-update-status';

// coupon
export const POST_ADD_COUPON = 'add-coupon';
export const GET_CREATED_COUPON = 'user-coupon-list';
export const POST_CHANGE_TRAINER_COUPON_STATUS = 'coupon-change-status';

// store
export const POST_APPLY_COUPON_STORE = 'store-api/apply-coupon';
export const POST_REMOVE_COUPON_STORE = 'store-api/cancel-coupon';

// course / retreat coupon
export const POST_USER_COURSE_RETREAT_COUPON = 'apply-coupon';

// Add course
export const POST_ADD_COURSE = 'addcourse';

// LOGIN
export const POST_LOGIN_OTP_REQUEST = 'request-otp';

// TERMS AND CONDITIONS
export const GET_TERMS = 'term-and-condition';
export const GET_POLICY = 'privacy-policy';

// ---------------------- training api
export const TRAINER_COURSE_DETAILS = (id: number) => `course-detail?id=${id}`;
export const TRAINER_RETREAT_DETAILS = (id: number) =>
  `retreat-detail?id=${id}`;

export const NOTIFICATION_LIST = (id: number) => {
  return `notification-list?receiver_id=${id}&receiver_type=trainer`;
};

export const NOTIFICATION_READ_LIST = (id: number) => {
  return `notifications-read?id=${id}`;
};

export const RETREAT_BOOKING_DETAILS = (id: number) =>
  `user-retreat-booking-detail?id=${id}`;
export const RETREAT_BOOKING_HISTORY = (id: number) =>
  `retreat-booking-history?booking_id=${id}`;
export const RETREAT_BOOING_END = 'retreat-booking-end';

export const TRAINER_REGISTRATION = "trainer-registration"