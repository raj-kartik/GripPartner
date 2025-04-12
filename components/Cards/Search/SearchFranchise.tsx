import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {moderateScale, screenWidth} from '../../Matrix/Matrix';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Colors from '../../../utils/Colors';
import CustomText from '../../Customs/CustomText';
import { globalStyle } from '../../../utils/GlobalStyle';
import Images from '../../../utils/Images';


const SearchFranchise = ({item, type}: any) => {
  const navigation = useNavigation();
  const {user} = useSelector((state: any) => state.user);
  const userId = user?.data?.id;

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FranchiseDetailScreen',
            params: {
              franchiseid: item?.id,
              loginUser: userId,
              userid: item?.user_id,
            },
          }),
        );
      }}>
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
      {item?.user_image ? (
        <Image style={styles.img} source={{uri: item?.user_image}} />
      ) : (
        <View style={[styles.img, {backgroundColor: '#f7f7f7'}]}>
          <Images.Logo />
        </View>
      )}

      <View style={styles.content}>
        <CustomText
          text={`Since ${item?.year_of_establishment}`}
          weight="500"
          customStyle={{
            position: 'absolute',
            top: moderateScale(0),
            right: moderateScale(0),
          }}
        />
        <View>
          <CustomText text={item?.title} weight="700" size={18} />
          <CustomText
            weight="600"
            text={`${item?.trainer || ''}`}
            customStyle={{
              textAlign: 'justify',
              textAlignVertical: 'bottom',
              marginTop: moderateScale(3),
            }}
          />
          <View>
            {/* <View style={[globalStyle.row, {marginTop: moderateScale(5)}]}>
                  {renderStars()}
                </View> */}
            <CustomText
              size={14}
              customStyle={{marginTop: moderateScale(3)}}
              weight="400"
              text={`${item.investment_required} sqFt.`}
            />
          </View>
        </View>
        {/* <CustomText
              color={colors.gray_font}
              customStyle={{marginTop: moderateScale(5)}}
              size={12}
              text={
                item?.description?.length > 30
                  ? `${item.description.slice(0, 100)}...`
                  : item?.description
              }
            /> */}
      </View>
      {/* {item?.price && (
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
              ]}></View>
          )} */}
      {/* <CustomText
            text={item.Address.length > 30 && `${item?.Address.slice(0, 30)}..`}
            color={colors.gray}
            size={12}
          /> */}

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

export default SearchFranchise;
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
