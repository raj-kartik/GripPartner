import { Image, StyleSheet, View } from "react-native";
import CustomIcon from "../Customs/CustomIcon";
import CustomText from "../Customs/CustomText";
import { moderateScale, screenHeight, screenWidth } from "../Matrix/Matrix";
import Images from "../../utils/Images";
import { globalStyle } from "../../utils/GlobalStyle";

const FollowUpCard = ({ follow }: any) => {

  console.log("FollowUpCard follow:", follow);

  return (
    <View style={styles.cardRow}>
      <View style={styles.row1}>
        {/* <Avatar
            size={50}
            avatarStyle={{backgroundColor: '#D3D3D3'}}
            rounded
            source={Images.One}
          /> */}
        {/* <Image source={{uri:Images.}} /> */}
        <View style={[globalStyle.center, { borderRadius: moderateScale(100), width: moderateScale(70), height: moderateScale(70) }]} >
          <Images.Logo />
        </View>
        <View>
          <CustomText
            size={20}
            weight="700"
            // family="Roboto-Bold"
            text={follow?.Name || 'No Name'}
          />
          <CustomText size={12} text={follow?.course_name} weight="500" />
        </View>
      </View>

      <View>
        <View style={[styles.row1, { marginBottom: moderateScale(5) }]}>
          <CustomIcon
            size={20}
            type="MaterialCommunityIcons"
            name="message-reply-outline"
          />
          <CustomText
            text={
              follow.comments.length > 10
                ? `${follow.comments.substring(0, 10)}...`
                : follow.comments
            }
            weight="500"
          />
        </View>
        <View style={styles.row1}>
          <CustomIcon type="Feather" name="calendar" size={20} color="#000" />
          <CustomText text={follow?.follow_up_date} weight="500" />
        </View>
      </View>
    </View>
  );
};

export default FollowUpCard;

const styles = StyleSheet.create({
  cardRow: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 5,
    borderRadius: moderateScale(10),
    width: screenWidth * .95,
    height: screenHeight * .12,
    padding: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    // width: responsiveWidth(40),
  },
});