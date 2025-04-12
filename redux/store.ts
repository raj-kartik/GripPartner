import {configureStore} from '@reduxjs/toolkit';
import LocationReducer from './Slice/LiveSlice';
import CourseReducer from './Slice/CourseSlice';
import RetreatReducer from './Slice/RetreatSlice';
import ReferralReducer from './Slice/ReferalSlice';
import WalletReducer from './Slice/WalletSlice';
import UserReducer from './Slice/UserSlice/UserSlice';
import OrderReducer from './Slice/OrderSlice';
import FeatureReducer from './Slice/FeatureSlice';
import CouponReducer from './Slice/CouponSlice';
const store = configureStore({
  reducer: {
    location: LocationReducer,
    course: CourseReducer,
    retreat: RetreatReducer,
    referral: ReferralReducer,
    wallet: WalletReducer,
    user: UserReducer,
    order: OrderReducer,
    feature: FeatureReducer,
    coupon:CouponReducer,
  },
});

export default store;
