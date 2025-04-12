import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, screenHeight, screenWidth } from '../Matrix/Matrix';
// import Colors from '../../style/Colors';
// import CustomText from '../Custom/CustomText';
// import { Images } from '../../../utils/Images/Images';
// import { globalStyle } from '../../../utils/GlobalStyles';
// import { Divider, Icon, Slider } from 'react-native-elements';
// import CustomIcon from '../Custom/CustomIcon';

import { CommonActions, useNavigation } from '@react-navigation/native';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';
import CustomIcon from '../Customs/CustomIcon';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';

const TrainersCard1 = ({ item }: any) => {
  const navigation = useNavigation();
  const trainerName = item?.name || '';
  const truncatedName =
    trainerName.length > 20
      ? `${trainerName.slice(0, 20).trim()}...`
      : trainerName;

  // console.log('--- item in the trainer card ---', item);

  const SentToTrainer = (item: any, id: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerDetails',
        params: {
          Trainer_id: id,
          Trainer: item,
        },
      }),
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => SentToTrainer(item, item.id)}>

      {item['user image'] ? (
        <View style={styles.img}>
          <Image style={[styles.img, { flex: 1 }]} source={{ uri: item['user image'] }} />
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
        </View>
      )}

      <View style={styles.content}>
        <View style={[globalStyle.flex]}>
          <View style={{ flex: 0.7 }}>
            <CustomText size={18} weight="700" text={truncatedName} />
            <CustomText
              size={14}
              customStyle={{ marginTop: moderateScale(0) }}
              weight="500"
              color={Colors.gray_font}
              text={`By ${item["studio name"]}`}
            />
          </View>
        </View>

        <View style={[globalStyle.row, { marginTop: moderateScale(10) }]}>
          {/* courses */}
          <View
            style={[
              globalStyle.row,
              { marginLeft: moderateScale(0), flex: 0.7 },
            ]}>
            <CustomIcon type="Entypo" name="graduation-cap" size={18} />
            <CustomText
              weight="500"
              text={`Courses ${item?.course}`}
              customStyle={{ marginLeft: moderateScale(5) }}
            />
          </View>

          {/* retreats */}
          <View
            style={[
              globalStyle.row,
              {
                marginLeft: moderateScale(5),
                flex: 0.4,
                width: '100%',
                flexWrap: 'wrap',
              },
            ]}>
            <Images.Yoga1
              width={moderateScale(20)}
              height={moderateScale(20)}
            />
            <CustomText
              weight="500"
              text={`Retreats ${item?.Retreat}`}
              customStyle={{ marginLeft: moderateScale(5) }}
            />
          </View>
        </View>

        {/* <View
          style={[globalStyle.betweenCenter, { marginTop: moderateScale(10) }]}>
        
          <View
            style={[
              globalStyle.row,
              { marginLeft: moderateScale(0), flex: 0.7 },
            ]}>
            <CustomIcon type="FontAwesome" name="briefcase" size={16} />
            <CustomText
              weight="500"
              text={`Job ${item?.Job}`}
              customStyle={{ marginLeft: moderateScale(5) }}
            />
          </View>

          <View
            style={[
              globalStyle.row,
              {
                marginLeft: moderateScale(5),
                flex: 0.4,
                width: '100%',
                flexWrap: 'wrap',
              },
            ]}>
            <CustomIcon type="MaterialIcons" name="account-tree" size={18} />
            <CustomText
              weight="500"
              size={14}
              text={`Franchise ${item['no of course'] || 0}`}
              // text='Franchise 100'
              customStyle={{ marginLeft: moderateScale(5) }}
            />
          </View>
        </View> */}
      </View>
    </Pressable>
  );
};

export default TrainersCard1;

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.9,
    marginRight: moderateScale(10),
    marginLeft: moderateScale(5),
    height: screenHeight * 0.4,
    borderRadius: moderateScale(10),
    backgroundColor: Colors.white,
    elevation: 3,
    marginBottom: moderateScale(15),
    // borderWidth: 0.1,
  },
  content: {
    flex: 0.2,
    padding: moderateScale(10),
  },
  img: {
    flex: 0.7,
    borderRadius: moderateScale(10),
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: moderateScale(10),
  },
});
