import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import { CommonActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';
import CustomIcon from '../Customs/CustomIcon';
import Images from '../../utils/Images';

const CourseCard2 = ({ item }: any) => {
  // console.log('==== item in the course screen ====', item);
  const navigation = useNavigation();

  const classType = item?.class_type.split(",");
  // console.log("==== classType === ", classType);


  const sendId = (item: any, id: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        // name: 'CourseDetails',
        name: 'CourseDetails',
        params: {
          courseid: id,
          course: item,
        },
      }),
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        sendId(item, item?.id);
      }}>
      {item?.class_type === 'Virtual Class' && (
        <View style={[styles.distance, globalStyle.center]}>
          <CustomText text={`${item?.distance || 0} Km`} weight="500" />
        </View>
      )}

      {item?.select_image ? (
        <View style={[styles.imgContainer, { zIndex: 5 }]}>
          <Image source={{ uri: item?.select_image }} style={styles.img} />
          {item?.price && (
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255,1)',
                padding: moderateScale(5),
                bottom: moderateScale(5),
                borderRadius: moderateScale(2),
                left: moderateScale(5),
              }}>
              <CustomText weight="600" text={`₹${item?.price}`} />
            </View>
          )}

          <View
            style={{
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255,1)',
              padding: moderateScale(10),
              bottom: moderateScale(5),
              borderRadius: moderateScale(5),
              right: moderateScale(5),
            }}>
            <CustomIcon type="AntDesign" size={18} name="star" color="orange" />
            <CustomText
              size={16}
              weight="500"
              text={parseFloat(item?.review?.averageRating).toFixed(1)}
            />
            <CustomText
              text={`(${parseFloat(item?.review?.reviewCount).toFixed(0)})`}
              weight="700"
              customStyle={{ marginTop: moderateScale(3) }}
            />
          </View>
        </View>
      ) : (
        <View style={[styles.img, globalStyle.center]}>
          <Images.Logo />
        </View>
      )}
      <View style={styles.content}>
        <CustomText text={item?.name} weight="700" size={20} />
        <CustomText
          text={`By ${item?.trainer.trim() || 'Grip Partner'}`}
          weight="500"
          color={Colors.gray_font}
          size={14}
          customStyle={{ marginBottom: moderateScale(10) }}
        />

        {item?.location && (
          <View style={[globalStyle.row, { marginBottom: moderateScale(5) }]}>
            <CustomIcon size={20} type="Ionicons" name="location-sharp" />
            <CustomText
              weight="500"
              customStyle={{ marginLeft: moderateScale(5) }}
              text={
                item?.location.length > 40
                  ? `${item?.location.substr(0, 40)}...`
                  : item?.location
              }
            />
          </View>
        )}

        {item["slot and time"]?.first_start_time && (
          <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5) }]}>
            <CustomIcon color="#8c8c8c" type="Ionicons" name="time-outline" />
            <CustomText
              weight="500"
              color="#8c8c8c"
              customStyle={{ marginLeft: moderateScale(5) }}
              text={`Starts from ${moment((item["slot and time"]?.first_start_time), "HH:mm").format("hh:mm A")} ownwards`}
            />
          </View>
        )}

        {item["slot and time"]?.total_slots && (
          <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5) }]}>
            <CustomIcon color="#8c8c8c" type="Feather" name="bookmark" />
            <CustomText
              weight="500"
              color="#8c8c8c"
              customStyle={{ marginLeft: moderateScale(5) }}
              text={`${item["slot and time"]?.total_slots} ${item["slot and time"]?.total_slots === 1 ? "Batch" : "Batches"}`}
            />
          </View>
        )}

        {
          classType && classType.includes("Virtual Class") && (
            <View style={{ position: "absolute", bottom: moderateScale(10), left: moderateScale(10) }} >
              <CustomText text='*Online Classes Available' weight='500' />
            </View>
          )
        }

      </View>
    </Pressable>
  );
};

export default CourseCard2;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: screenHeight * 0.5,
    elevation: 5,
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',
    marginTop: moderateScale(2),
    marginBottom: moderateScale(15),
    alignSelf: 'center',
  },
  img: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    flex: 1,
  },
  imgContainer: {
    width: '100%',
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(5),
  },
  distance: {
    position: 'absolute',
    zIndex: 9,
    top: moderateScale(10),
    right: moderateScale(10),
    backgroundColor: 'rgba(247, 247, 247,0.9)',
    width: '15%',
    paddingVertical: moderateScale(1),
    borderRadius: moderateScale(2),
  },
});
