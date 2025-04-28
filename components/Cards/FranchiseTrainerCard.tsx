import { View } from "react-native";
import { globalStyle } from "../../utils/GlobalStyle";
import { moderateScale, screenWidth } from "../Matrix/Matrix";
import Images from "../../utils/Images";
import CustomText from "../Customs/CustomText";
import Colors from "../../utils/Colors";
import CustomIcon from "../Customs/CustomIcon";

export const FranchiseTrainerCard = ({booking}: any) => {
    // console.log('==== booking in retreat user card ===', booking);
  
    return (
      <View
        style={[
          globalStyle.flex,
          {
            backgroundColor: '#f7f7f7',
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
            marginBottom: moderateScale(10),
            width: screenWidth * 0.95,
          },
        ]}>
        {/* about */}
        <View style={[globalStyle.flex, {flex: 0.8}]}>
          <View
            style={[
              globalStyle.center,
              {
                width: moderateScale(60),
                height: moderateScale(60),
                borderRadius: moderateScale(100),
                backgroundColor: '#000',
              },
            ]}>
            <Images.LogoW width={moderateScale(50)} height={moderateScale(50)} />
          </View>
  
          <View style={{marginLeft: moderateScale(5)}}>
            {/* name */}
            <CustomText text={booking.name} size={18} weight="600" />
  
            <View>
              {/* <CustomText text="Retreat" size={12} /> */}
              <CustomText
                text={booking['retreat name']}
                size={16}
                weight="500"
                color={Colors.gray_font}
              />
            </View>
          </View>
        </View>
  
        {/* content  */}
        <View style={{flex: 0.3}}>
          {/* status */}
          <View style={[globalStyle.row, {marginBottom: moderateScale(5)}]}>
            <CustomIcon
              type="Feather"
              size={22}
              name={
                booking['payment status'] === 'Unpaid'
                  ? 'alert-circle'
                  : 'check-circle'
              }
              color={
                booking['payment status'] === 'Unpaid'
                  ? Colors.orange
                  : Colors.activeRadio
              }
            />
            <CustomText
              weight="500"
              text={booking['payment status']}
              customStyle={{marginLeft: moderateScale(3)}}
            />
          </View>
          <View style={[globalStyle.row]}>
            <CustomIcon type="Feather" size={22} name="calendar" />
            <CustomText
              weight="500"
              // text={moment(booking.payment_date).format("MMM Do YY")}
              text={booking.payment_date}
              customStyle={{marginLeft: moderateScale(3)}}
            />
          </View>
        </View>
      </View>
    );
  };