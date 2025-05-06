import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { globalStyle } from '../../../../utils/GlobalStyle'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import CustomModal from '../../../../components/Customs/CustomModal'
import CustomText from '../../../../components/Customs/CustomText'
import CustomButton from '../../../../components/Customs/CustomButton'
import { POST_CHANGE_TRAINER_COUPON_STATUS } from '../../../../utils/api'
import makeApiRequest from '../../../../utils/ApiService'
import CustomToast  from '../../../../components/Customs/CustomToast'
import { getCouponTrainer } from '../../../../redux/Slice/CouponSlice'
import CouponCard from '../../../../components/Cards/CouponCard'
import Colors from '../../../../utils/Colors'

const Coupons = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state?.user);
  const { coupon } = useSelector((state: any) => state?.coupon);
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  // console.log("=== coupon in trainer coupon ===", selectedCoupon);



  useFocusEffect(useCallback(() => {
    const fetchCouponse = async () => {
      await dispatch(getCouponTrainer(user?.id));
    }

    fetchCouponse();
  }, []));

  // console.log("=== selected coupon ===", selectedCoupon);

  const handleStatus = async () => {
    try {
      const response: any = await makeApiRequest({
        url: POST_CHANGE_TRAINER_COUPON_STATUS,
        method: "POST",
        data: {
          id: selectedCoupon?.id,
          type: selectedCoupon?.type
        }
      });

      if (response?.status === 'success') {
        CustomToast({
          type: "success",
          text1: "Coupon Status Changed",
          text2: "Coupon Status Changed Successfully"
        });
        await dispatch(getCouponTrainer(user?.id));
        setIsActiveModal(false);
      }
    }
    catch (err: any) {
      console.log("=== err in handle status ===", err);
    }
  }

  return (
    <Container>
      <CustomHeader2 handleMore={()=>{navigation.navigate('CreateCoupons')}} title="Created Coupons" isMore={true} iconType="MaterialIcons" iconName="add" />

      {/* all coupons listing */}
      <FlatList data={coupon} keyExtractor={item => item?.id}
        renderItem={({ item }: any) => {
          return (
            <CouponCard item={item} handlePress={() => {
              setIsActiveModal(true);
              setSelectedCoupon(item)
            }} />
          )
        }}
      />


      {
        isActiveModal && selectedCoupon && (
          <CustomModal visible={isActiveModal} iscenter={false} containerStyle={{ width: screenWidth, height: screenHeight * .4 }} onDismiss={() => { setIsActiveModal(false) }} >

            <View style={{ backgroundColor: Colors.gray_font, width: "30%", height: moderateScale(5), marginVertical: moderateScale(10), alignSelf: "center", borderRadius: moderateScale(10) }} />
            <View style={{ flex: .8 }} >
              <View style={{ alignItems: "center", justifyContent: "center", marginBottom: moderateScale(10), position: "absolute", top: moderateScale(0), right: moderateScale(10) }} >
                <CustomIcon type='MaterialIcons' size={30} name='check-circle' color={selectedCoupon?.status.toLowerCase() === "active" ? Colors.success : Colors.red} />
              </View>
              <View>
                <CustomText text={('Coupon').toUpperCase()} weight='600' size={16} color={Colors.gray_font} />
                <CustomText text={selectedCoupon?.code} weight='700' size={20} />
              </View>
              <View style={{ marginTop: moderateScale(10) }} >
                <CustomText text={('Discount').toUpperCase()} weight='600' size={16} color={Colors.gray_font} />
                {
                  selectedCoupon?.discount_type === "percentage" && (
                    <View style={[globalStyle.row]} >
                      <CustomText text={selectedCoupon?.discount_value} color={Colors.orange} customStyle={{ marginRight: moderateScale(2) }} weight='700' size={40} />
                      <CustomIcon customStyle={{ marginLeft: moderateScale(2) }} color={Colors.orange} type='MaterialCommunityIcons' name='brightness-percent' size={30} />
                    </View>
                  )
                }

                {
                  selectedCoupon?.discount_type !== "percentage" && (
                    <View style={[globalStyle.row]} >
                      <CustomIcon customStyle={{ marginLeft: moderateScale(2) }} type='MaterialIcons' size={30} color={Colors.orange} name='currency-rupee' />
                      <CustomText text={selectedCoupon?.discount_value} color={Colors.orange} customStyle={{ marginRight: moderateScale(2) }} weight='700' size={40} />
                    </View>
                  )
                }
              </View>

              <View>
                <CustomText text={('Valid Till').toUpperCase()} weight='600' size={16} color={Colors.gray_font} />
                <CustomText text={moment(selectedCoupon?.end_date).format("MMM Do YYYY")} weight='700' size={20} />
              </View>
            </View>
            <View style={{ flex: .2 }}>
              <CustomButton onPress={handleStatus} title={selectedCoupon?.status.toLowerCase() === "active" ? "Deactivate" : "Activate"} />
            </View>
          </CustomModal>
        )
      }
    </Container>
  )
}

export default Coupons

const styles = StyleSheet.create({})