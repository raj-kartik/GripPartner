import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, screenWidth } from '../../Matrix/Matrix';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CustomText from '../../Customs/CustomText';
import Colors from '../../../utils/Colors';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomIcon from '../../Customs/CustomIcon';
import Images from '../../../utils/Images';

const SearchShop = ({ item, type }: any) => {
    //   console.log('===== item in the search shop ====', item, type);

    // const {fullStars, emptyStars} = item?.review;

    // const renderStars = () => {
    //   const stars = [];

    //   // Add full stars
    //   for (let i = 0; i < fullStars; i++) {
    //     stars.push(
    //       <CustomIcon
    //         size={12}
    //         color={Colors.text_orange}
    //         type="AntDesign"
    //         name="staro"
    //       />,
    //     );
    //   }

    //   // Add empty stars
    //   for (let i = 0; i < emptyStars; i++) {
    //     stars.push(
    //       // <FontAwesome key={`empty-${i}`} name="star-o" size={20} color="gray" />,
    //       <CustomIcon
    //         type="AntDesign"
    //         size={12}
    //         color={Colors.text_orange}
    //         name="staro"
    //       />,
    //     );
    //   }

    //   return stars;
    // };


    const navigation = useNavigation();

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'Description',
                        params: {
                            sku: item.sku,
                            specialPrice: item?.special_price,
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
            {item?.image ? (
                <Image style={styles.img} source={{ uri: item?.image }} />
            ) : (
                <View style={[styles.img, { backgroundColor: '#f7f7f7' }]}>
                    <Images.Logo />
                </View>
            )}

            <View style={styles.content}>
                <View style={{ flex: 0.7 }}>
                    <CustomText
                        text={
                            item?.name.length > 100
                                ? `${item?.name.slice(0, 100)}...`
                                : item?.name
                        }
                        weight="700"
                        size={18}
                    />
                </View>

                <View style={{ flex: 0.3 }}>
                    <CustomText
                        text={`₹${parseFloat(item?.special_price).toFixed(2)}`}
                        weight="500"
                    />
                    <CustomText
                        color={Colors.gray_font}
                        customStyle={{ textDecorationLine: 'line-through' }}
                        text={`₹${parseFloat(item?.price).toFixed(2)}`}
                        weight="500"
                    />
                </View>
            </View>

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

export default SearchShop;

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
