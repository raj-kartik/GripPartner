import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { moderateScale, screenWidth } from '../Matrix/Matrix';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';
import CustomIcon from '../Customs/CustomIcon';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
interface Props {
  item: any;
  navigation: any;
}
const CourseCard1: FC<Props> = ({ item, navigation }) => {
  // Navigate to course detail screen
  const navigateToCourse = (id: number) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerCourseDetails',
        params: {
          course_id: item.id,
        },
      }),
    )
  };
  return (
    <Pressable
      style={[styles.container, styles.courseCard]}
      key={item.id}
      onPress={() => navigateToCourse(item?.id)}>
      {/* Image Section */}
      {item?.select_image ? (
        <View style={styles.img}>
          <Image style={styles.img} source={{ uri: item?.select_image }} />
          <View
            style={[globalStyle.flex, {
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
              text={parseFloat(item?.fullstar).toFixed(1)}
              weight="700"
              customStyle={{ marginTop: moderateScale(3) }}
            />
            <CustomText
              text={` (${parseFloat(item?.totalreview).toFixed(0)})`}
              weight="700"
              customStyle={{ marginTop: moderateScale(3), alignSelf: "center", textAlign: "center", justifyContent: "center" }}
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
        </View>
      )}

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Course Title */}
        <CustomText
          text={item?.name}
          customStyle={{ marginTop: moderateScale(10) }}
          size={18}
          weight="700"
        />
        <CustomText
          text={item?.trainer}
          color={Colors.gray_font}
          weight="500"
        />

        {/* body focus */}
        <View style={[globalStyle.row, { marginTop: moderateScale(0) }]}>
          <View style={[globalStyle.between, styles.addressReviewContainer]}>
            {/* Address */}
            <View style={[globalStyle.flex, styles.addressContainer]}>
              <CustomIcon type="Ionicons" name="barbell" size={18} />
              <CustomText
                weight="500"
                customStyle={{ marginLeft: moderateScale(5) }}
                text={
                  item?.body_focus.length > 30
                    ? `${item?.body_focus.substr(0, 30)}...`
                    : item?.body_focus
                }
              />
            </View>
          </View>
        </View>

        <View>
          {item.video ? (
            <View style={[globalStyle.row, { marginTop: moderateScale(10) }]}>
              <CustomIcon type="Ionicons" name="videocam" size={18} />
              <CustomText
                customStyle={{ marginLeft: moderateScale(3) }}
                text="Online classes are also available"
              />
            </View>
          ) : null}

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

        </View>
      </View>

      {item?.price ? (
        <View
          style={[
            globalStyle.flex,
            {
              position: 'absolute',
              bottom: moderateScale(10),
              right: moderateScale(10),
            },
          ]}>
          <CustomText
            text="From"
            customStyle={{ textAlignVertical: 'bottom' }}
            size={12}
          />
          <CustomText text={`₹${item.price.toString()}`} customStyle={{ marginLeft: moderateScale(3) }} weight="700" />
        </View>
      ) : (
        <View
          style={[
            globalStyle.flex,
            {
              position: 'absolute',
              bottom: moderateScale(10),
              right: moderateScale(10),
            },
          ]}>
          <CustomText weight="500" text={`Free`} />
        </View>
      )}
    </Pressable>
  );
};

export default CourseCard1;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    width: screenWidth * 0.88,
    alignSelf: 'center',
    marginRight: moderateScale(10),
  },
  courseCard: {
    height: screenWidth * 0.8,
    marginRight: moderateScale(5),
  },
  imageContainer: {
    flex: 1.5,
    marginBottom: moderateScale(10),
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(10),
  },
  detailsContainer: {
    flex: 1,
  },
  addressReviewContainer: {
    marginTop: moderateScale(3),
    marginLeft: 0,
    paddingLeft: 0,
  },
  addressContainer: {
    // flex: 0.7,
  },
  reviewContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  centerAligned: {
    alignItems: 'center',
  },
  img: {
    width: '100%',
    flex: 1,
    borderRadius: moderateScale(10),
    // resizeMode:"repeat",
  },
});
