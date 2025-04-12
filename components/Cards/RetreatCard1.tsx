import { CommonActions, useNavigation } from "@react-navigation/native";
import { moderateScale, screenWidth } from "../Matrix/Matrix";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { globalStyle } from "../../utils/GlobalStyle";
import CustomIcon from "../Customs/CustomIcon";
import CustomText from "../Customs/CustomText";
import Colors from "../../utils/Colors";
import Images from "../../utils/Images";

const RetreatCard1 = ({ item, userId, width = screenWidth * .75 }: any) => {
    const navigation = useNavigation();
    // console.log("====== item in the retreat card =====", item);
  
    const SentToRetreat = (item: any, id: any) => {
      console.log(item, 'vff');
      navigation.dispatch(
        CommonActions.navigate({
          name: 'RetreatDetails',
          params: {
            retreatid: id,
            userid: item.user_id,
            loginUser: userId,
          },
        }),
      );
    };
  
    return (
      <Pressable
        style={[styles.container, { width }]}
        onPress={() => SentToRetreat(item, item.id)}>
  
        {item?.image ? (
          <View style={styles.img}>
            <Image style={[styles.img, { flex: 1 }]} source={{ uri: item?.image }} />
            <View
              style={[globalStyle.flex,{
                alignItems: 'center',
                position: 'absolute',
                backgroundColor: '#fff',
                borderRadius: moderateScale(5),
                padding: moderateScale(5),
                bottom: moderateScale(5),
                right: moderateScale(10),
                elevation: 3,
              }]}>
              <CustomIcon type="AntDesign" name="star" color={Colors.orange} />
              <CustomText
                text={parseFloat(item?.review?.fullStars).toFixed(1)}
                weight="700"
                customStyle={{ marginTop: moderateScale(3) }}
              />
              <CustomText
                text={` (${parseFloat(item?.review?.reviewCount).toFixed(0)})`}
                weight="700"
                customStyle={{ marginTop: moderateScale(3) }}
              />
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.img,
              globalStyle.center,
              { backgroundColor: '#f7f7f7' },
            ]}>
            <Images.Logo />
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                backgroundColor: '#fff',
                borderRadius: moderateScale(5),
                padding: moderateScale(5),
                bottom: moderateScale(5),
                right: moderateScale(10),
                elevation: 3,
              }}>
              <CustomIcon type="AntDesign" name="star" color={Colors.orange} />
              <CustomText
                text={parseFloat(item?.review?.fullStars).toFixed(1)}
                weight="700"
                customStyle={{ marginTop: moderateScale(3) }}
              />
              <CustomText
                text={parseFloat(item?.review?.reviewCount).toFixed(0)}
                weight="700"
                customStyle={{ marginTop: moderateScale(3) }}
              />
            </View>
          </View>
        )}
        {/* content */}
        <View
          style={{
            flex: 0.4,
            marginHorizontal: moderateScale(10),
            marginBottom: moderateScale(10),
          }}>
          <View
            style={[
              globalStyle.row,
              { marginTop: moderateScale(10), alignItems: 'flex-start' },
            ]}>
            <View style={[globalStyle.between]}>
              <CustomText
                // text={item?.title}
                text={
                  item?.title.length > 30
                    ? `${item?.title.slice(0, 30).trim()}...`
                    : item?.title
                }
                weight="700"
                size={18}
                customStyle={{ flex: 0.65 }}
              />
              <View
                style={{
                  flex: 0.3,
                  alignItems: 'flex-end',
                  alignContent: 'center',
                }}>
              </View>
            </View>
          </View>
  
          {/* <CustomText text='Location' /> */}
          <View style={[globalStyle.flex, { marginTop: moderateScale(10) }]}>
            <CustomIcon type="Ionicons" size={18} name="location-sharp" />
            <View style={[globalStyle.row, { flex: 1 }]}>
              {/* {address.slice(-3).map((item, index, arr) => {
                if (index === arr.length - 1) return null; // Skip the last index
                return (
                  <View key={index}  >
                    <CustomText
                      customStyle={{flexWrap:"wrap"}}
                      size={13}
                      weight="400"
                      text={index === arr.length - 2 ? item : `${item},`}
                    />
                  </View>
                );
              })} */}
              <CustomText text={item?.location} weight="500" size={13} />
            </View>
          </View>
  
          <View
            style={[globalStyle.row, { marginTop: moderateScale(0), flex: 0.5 }]}>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginRight: moderateScale(10),
              }}>
              {/* <Icon name="groups" size={22} color={'black'} /> */}
              <CustomText
                family="Roboto-Regular"
                size={14}
                text={`${item?.group_size} Person`}
              />
            </View>
  
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              {/* <Icon
                name="calendar"
                type="font-awesome"
                size={16}
                color={'black'}
              /> */}
              <CustomText
                family="Roboto-Regular"
                size={14}
                text={`${item?.no_of_days} Days`}
              />
            </View>
          </View>
          <CustomText
            size={14}
            weight="500"
            customStyle={{
              position: 'absolute',
              bottom: moderateScale(0),
              right: moderateScale(5),
            }}
            text={`From ₹${item['price']}`}
          />
        </View>
      </Pressable>
    );
  };
  
  export default RetreatCard1;
  
  const styles = StyleSheet.create({
    container: {
      width: screenWidth * 0.75,
      height: screenWidth * 0.9,
      backgroundColor: 'white',
      marginRight: moderateScale(15),
      borderRadius: moderateScale(10),
      elevation: 5,
      marginBottom: moderateScale(15),
      marginVertical: moderateScale(3),
      marginLeft: moderateScale(5),
    },
    img: {
      flex: 0.6,
      width: '100%',
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
    },
    btn: {
      // borderWidth:0.5,
      // borderColor:"#000",
      padding: moderateScale(5),
      borderRadius: moderateScale(5),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      backgroundColor: '#fff',
      paddingHorizontal: moderateScale(10),
    },
  });
  