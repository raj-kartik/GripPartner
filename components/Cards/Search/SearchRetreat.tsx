import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { moderateScale, screenWidth } from '../../Matrix/Matrix';
import { useSelector } from 'react-redux';
import CustomText from '../../Customs/CustomText';
import Images from '../../../utils/Images';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomIcon from '../../Customs/CustomIcon';
import Colors from '../../../utils/Colors';

const SearchRetreat = ({ item, type }: any) => {
    const navigation = useNavigation();
    const user = useSelector((state: any) => state.user);
    const userId = user?.user?.data?.id;

    const { fullStars, emptyStars, averageRating } = item?.review;
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

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'RetreatDetailsScreen',
                        params: {
                            retreatid: item?.id,
                            userid: userId,
                            loginUser: userId,
                        },
                    }),
                );
            }}>
            {item?.select_image ? (
                <Image source={{ uri: item?.select_image }} style={styles.img} />
            ) : (
                <View style={styles.img}>
                    <Images.Logo />
                </View>
            )}

            <View style={styles.content}>
                <View style={[globalStyle.betweenCenter]}>
                    <CustomText
                        text={
                            item.name?.length > 25
                                ? `${item?.name.substr(0, 25)}...`
                                : item?.name
                        }
                        size={18}
                        weight="700"
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Text>{renderStars()}</Text>
                        <CustomText
                            text={`Review(${parseFloat(averageRating).toFixed(1)})`}
                            size={10}
                            weight="500"
                        />
                    </View>
                </View>

                <CustomText
                    text={item?.trainer}
                    customStyle={{ marginTop: moderateScale(5) }}
                    weight="500"
                />
                <CustomText
                    text={`₹${item?.price}`}
                    customStyle={{ marginTop: moderateScale(5) }}
                    weight="500"
                />
            </View>
        </Pressable>
    );
};

export default SearchRetreat;

const styles = StyleSheet.create({
    img: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    content: {
        flex: 1,
        marginTop: moderateScale(5),
    },
    container: {
        width: '95%',
        height: screenWidth * 0.7,
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: '#fff',
        elevation: 5,
        marginTop: moderateScale(10),
        alignSelf: 'center',
        marginBottom: moderateScale(5),
    },
    jobType: {
        paddingHorizontal: moderateScale(5),
        paddingVertical: moderateScale(2),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: moderateScale(5),
        right: moderateScale(5),
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: moderateScale(2),
    },
});
