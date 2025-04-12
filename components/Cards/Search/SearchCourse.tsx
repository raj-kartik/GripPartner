import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {moderateScale, screenWidth} from '../../Matrix/Matrix';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CustomIcon from '../../Customs/CustomIcon';
import Colors from '../../../utils/Colors';
import CustomText from '../../Customs/CustomText';
import { globalStyle } from '../../../utils/GlobalStyle';
import Images from '../../../utils/Images';
// import CustomIcon from '../../Custom/CustomIcon';
// import Colors from '../../../style/Colors';
// import CustomText from '../../Custom/CustomText';
// import {globalStyle} from '../../../../utils/GlobalStyles';
// import {Images} from '../../../../utils/Images/Images';


const SearchCourse = ({item, type}: any) => {
  const {fullStars, emptyStars} = item?.review;

  const renderStars = () => {
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <CustomIcon
          size={12}
          color={Colors.text_orange}
          type="AntDesign"
          name="staro"
        />,
      );
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        // <FontAwesome key={`empty-${i}`} name="star-o" size={20} color="gray" />,
        <CustomIcon
          type="AntDesign"
          size={12}
          color={Colors.text_orange}
          name="staro"
        />,
      );
    }

    return stars;
  };

  const navigation = useNavigation();

  const navigateToCourse = (id:number) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetails',
        params: {courseid: id},
      }),
    );
  };

  return (
    <Pressable style={styles.container} onPress={()=>{
      navigateToCourse(item.id)
    }} >
      <View
        style={{
          position: 'absolute',
          top: moderateScale(15),
          right: moderateScale(15),
          zIndex: 9,
        }}>
        {/* {classType.length > 0 &&
            classType.map((item, index) => (
              <View
                key={index}
                style={[
                  {
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    padding: moderateScale(5),
                    marginBottom: moderateScale(3),
                    borderRadius: moderateScale(5),
                  },
                  globalStyle.center,
                ]}>
                <CustomText size={12} weight="700" text={item} />
              </View>
            ))} */}
      </View>
      {item?.select_image ? (
        <Image style={styles.img} source={{uri: item?.select_image}} />
      ) : (
        <View style={[styles.img, {backgroundColor: '#f7f7f7'}]}>
          <Images.Logo />
        </View>
      )}

      <View style={styles.content}>
        <View>
          <CustomText text={item?.name} weight="700" size={18} />
          <CustomText
            weight="600"
            text={`${item?.trainer.trim() || ''}`}
            customStyle={{textAlign: 'justify', textAlignVertical: 'bottom'}}
          />
          <View>
            <View style={[globalStyle.row, {marginTop: moderateScale(5)}]}>
              {renderStars()}
            </View>
            <CustomText size={12} text={`Review(${item.reviewCount || 0})`} />
          </View>
        </View>
        <CustomText
          color={Colors.gray_font}
          customStyle={{marginTop: moderateScale(5)}}
          size={12}
          text={
            item?.description?.length > 30
              ? `${item.description.slice(0, 100)}...`
              : item?.description
          }
        />
      </View>
      {item?.price && (
        <View
          style={[
            globalStyle.row,
            {
              position: 'absolute',
              bottom: moderateScale(5),
              right: moderateScale(10),
              backgroundColor: 'rgba(0,0,0)',
              padding: moderateScale(5),
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: moderateScale(8),
              borderRadius: moderateScale(3),
            },
          ]}>
          <CustomText size={12} weight="600" color="#fff" text="Price " />
          <CustomText
            size={12}
            weight="600"
            color="#fff"
            text={`Rs ${item?.price}`}
          />
        </View>
      )}

      <View
        style={{
          width: moderateScale(80),
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: moderateScale(10),
          paddingVertical: moderateScale(5),
          position: 'absolute',
          bottom: moderateScale(10),
          right: moderateScale(5),
          borderRadius: moderateScale(5),
        }}>
        <CustomText text={type} color="#fff" />
      </View>
    </Pressable>
  );
};

export default SearchCourse;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screenWidth * 0.7,
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
    padding: moderateScale(5),
  },
  img: {
    width: '100%',
    flex: 0.6,
    borderRadius: moderateScale(10),
  },
  content: {
    flex: 0.4,
    marginTop: moderateScale(5),
    paddingBottom: moderateScale(10),
  },
});
