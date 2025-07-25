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
import NotificationReducer from './Slice/NotificationSlice';
import BankReducer from './Slice/BankSlice';
import cartReducer from './Slice/AddToCartSlice';
import studioReducer from './Slice/StudioSlice';
import TrainerReducer from './Slice/TrainerSlice';
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
    coupon: CouponReducer,
    notification: NotificationReducer,
    bank: BankReducer,
    cart: cartReducer,
    studio: studioReducer,
    trainer: TrainerReducer,
  },
});

export default store;
