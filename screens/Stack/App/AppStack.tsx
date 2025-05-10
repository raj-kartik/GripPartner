import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { BottomTabs } from '../../../components/BottomNav/BottomTab'
import DrawerNav from '../../Bottom/DrawerNav'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CourseDetails from './CourseDetails'
import RetreatDetails from './RetreatDetails'
import ScannerCart from './ScannerCart'
import Search from './Search'
import ScanPaymentMethod from './ScanPaymentMethod'
import Description from './ECom/Description'
import OrdersHistory from './AccountScreen/OrdersHistory'
import WrittenReview from './AccountScreen/WrittenReview'
import Coupons from './AccountScreen/Coupons'
import Rewards from './AccountScreen/Rewards'
import Payments from './AccountScreen/Payments'
import UserCourseDetail from './AccountScreen/Course/UserCourseDetail'
import CompletedOrderDetails from './OrderStack/CompletedOrderDetails'
import StoreOrderDetails from './OrderStack/StoreOrderDetails'
import MyCart from './ECom/MyCart'
import CheckoutScreen from './ECom/CheckoutScree'
import PaymentScreen from './ECom/PaymentScreen'
import PaymentSuccessful from './ECom/PaymentSuccessful'
import TrainingDetail from '../../../components/CourseComponent/TrainingDetails'
import TrainerDetails from './TrainerDetails'
import Terms from './Terms'
import Policy from './Policy'
import OwnCourse from './AccountScreen/OwnCourse'
import OwnRetreat from './AccountScreen/OwnRetreat'
import TrainerCourseDetails from './AccountScreen/Course/TrainerCourseDetails'
import CreateCoupons from './AccountScreen/Coupon/CreateCoupons'
import CouponSuccess from './AccountScreen/Coupon/CouponSuccess'
import TrainerNewCourse from './AccountScreen/Course/TrainerCreateCourse'
import OrderDetails from '../../TopNav/OrderTopNav/OrderDetails'
import CourseTopNav from '../../TopNav/CourseTopNav/CourseTopNav'
import RetreatTopNav from '../../TopNav/RetreatTopNav/RetreatTopNav'
import RetreatLeadDetail from '../../TopNav/RetreatTopNav/RetreatLead/RetreatLeadDetail'
import RetreatFollowUpsDetail from '../../TopNav/RetreatTopNav/RetreatFollowUps/RetreatFollowUpsDetail'
import RetreatBookingDetail from '../../TopNav/RetreatTopNav/RetreatBooking/RetreatBookingDetail'
import CourseLeadDetails from '../../TopNav/CourseTopNav/CourseLead/CourseLeadDetails'
import CourseFollowDetails from '../../TopNav/CourseTopNav/CourseFollowUps/CourseFollowDetails'
import CourseSubsDetails from '../../TopNav/CourseTopNav/CourseSubs/CourseSubsDetails'
import CreateRetreat from './AccountScreen/Retreat/CreateRetreat'
import AddSubscription from '../../TopNav/CourseTopNav/CourseSubs/AddSubscription'
import LeadFollowUp from '../../TopNav/CourseTopNav/CourseFollowUps/LeadFollowUp'
import Settings from './Settings/Settings'
import UpdateProfile from './Settings/UpDateProfile'
import { ProductList } from '../../Drawer/ShopDrawer/ProductList'
import UpdateStudioProfile from './Settings/UpdateStudioProfile'
import PaymentScan from './PaymentScan'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { addToCart } from '../../../redux/Slice/AddToCartSlice'
import AddBookingScreen from '../../TopNav/RetreatTopNav/RetreatFollowUps/AddBookingScreen'
import AadharCardKyc from './KYC/AadharCardKyc'
import LocationTracker from './LocationTracker'
import KycVerification from '../KycVerification'
import StudioSuccess from '../../../components/Cards/Success/StudioSuccess'
import Studios from './AccountScreen/Studio/Studios'
import StudioDetail from './AccountScreen/Studio/StudioDetail'
import StudioEdit from './AccountScreen/Studio/StudioEdit'
// import LocationTracker from './LocationTracker'

// changes noething has made

const AppStack = () => {

    const dispatch = useDispatch();
    const Stack = createNativeStackNavigator();
    const { data } = useSelector((state: any) => state?.cart);
    useFocusEffect(useCallback(() => {
        const fetchCart = async () => {
            await dispatch(addToCart());
        }
        fetchCart();
    }, []));

    return (
        <View style={{ flex: 1 }} >
            {/* jdvjkfnjkv */}
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {/* <Stack.Screen name='DrawerNav' component={DrawerNav} /> */}
                <Stack.Screen name='BottomTabs' component={BottomTabs} />
                <Stack.Screen name='CourseDetails' component={CourseDetails} />
                <Stack.Screen name='RetreatDetails' component={RetreatDetails} />
                <Stack.Screen name='TrainingDetail' component={TrainingDetail} />
                <Stack.Screen name='TrainerDetails' component={TrainerDetails} />
                <Stack.Screen name='ScannerCart' component={ScannerCart} />
                <Stack.Screen name='Search' component={Search} />
                <Stack.Screen name='ScanPaymentMethod' component={ScanPaymentMethod} />
                <Stack.Screen name='CouponSuccess' component={CouponSuccess} />
                <Stack.Screen name='Description' component={Description} />
                <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />
                <Stack.Screen name='PaymentScreen' component={PaymentScreen} />
                <Stack.Screen name='PaymentSuccessful' component={PaymentSuccessful} />
                <Stack.Screen name='TrainerCourseDetails' component={TrainerCourseDetails} />
                <Stack.Screen name='CreateCoupons' component={CreateCoupons} />
                <Stack.Screen name='TrainerNewCourse' component={TrainerNewCourse} />
                <Stack.Screen name='OrderDetails' component={OrderDetails} />
                <Stack.Screen name='LeadFollowUp' component={LeadFollowUp} />
                <Stack.Screen name='Settings' component={Settings} />
                <Stack.Screen name='UpdateProfile' component={UpdateProfile} />
                <Stack.Screen name='UpdateStudioProfile' component={UpdateStudioProfile} />
                <Stack.Screen name='KycVerification' component={KycVerification} />
                <Stack.Screen name='PaymentScan' component={PaymentScan} />
                <Stack.Screen name='AddBookingScreen' component={AddBookingScreen} />
                <Stack.Screen name='Studios' component={Studios} />
                <Stack.Screen name='StudioSuccess' component={StudioSuccess} />

                <Stack.Screen name='AddSubscription' component={AddSubscription} />
                <Stack.Screen name='ProductList' component={ProductList} />
                <Stack.Screen name='AadharCardKyc' component={AadharCardKyc} />
                <Stack.Screen name='LocationTracker' component={LocationTracker} />
                <Stack.Screen name='StudioDetail' component={StudioDetail} />
                <Stack.Screen name='StudioEdit' component={StudioEdit} />

                {/* course top navigation */}
                <Stack.Screen name='CourseTopNav' component={CourseTopNav} />
                <Stack.Screen name='RetreatTopNav' component={RetreatTopNav} />



                {/* retreat top nav details */}
                <Stack.Screen name='RetreatLeadDetail' component={RetreatLeadDetail} />
                <Stack.Screen name='RetreatFollowUpsDetail' component={RetreatFollowUpsDetail} />
                <Stack.Screen name='RetreatBookingDetail' component={RetreatBookingDetail} />
                <Stack.Screen name='CreateRetreat' component={CreateRetreat} />

                {/* course top nav */}
                <Stack.Screen name='CourseLeadDetails' component={CourseLeadDetails} />
                <Stack.Screen name='CourseFollowDetails' component={CourseFollowDetails} />
                <Stack.Screen name='CourseSubsDetails' component={CourseSubsDetails} />

                {/* account screen */}
                <Stack.Screen name='OrdersHistory' component={OrdersHistory} />
                <Stack.Screen name='OwnCourse' component={OwnCourse} />
                <Stack.Screen name='OwnRetreat' component={OwnRetreat} />
                <Stack.Screen name='WrittenReview' component={WrittenReview} />
                <Stack.Screen name='Coupons' component={Coupons} />
                <Stack.Screen name='Rewards' component={Rewards} />
                <Stack.Screen name='Payments' component={Payments} />
                <Stack.Screen name='CompletedOrderDetails' component={CompletedOrderDetails} />
                <Stack.Screen name='UserCourseDetail' component={UserCourseDetail} />
                <Stack.Screen name='StoreOrderDetails' component={StoreOrderDetails} />
                <Stack.Screen name='MyCart' component={MyCart} />
                <Stack.Screen name='Terms' component={Terms} />
                <Stack.Screen name='Policy' component={Policy} />
                {/* <Stack.Screen name='ScannerCart' component={ScannerCart} /> */}
            </Stack.Navigator>
        </View>
    )
}

export default AppStack

const styles = StyleSheet.create({})