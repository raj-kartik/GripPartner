import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, screenWidth } from '../../Matrix/Matrix';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomText from '../../Customs/CustomText';
import Colors from '../../../utils/Colors';
import CustomIcon from '../../Customs/CustomIcon';
import { globalStyle } from '../../../utils/GlobalStyle';
import Images from '../../../utils/Images';


const SearchCareer = ({ item, type }: any) => {
    const navigation = useNavigation();
    const user = useSelector((state: any) => state.user);
    const userId = user?.user?.id;

    const { fullStars, emptyStars } = item?.review;
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

    // const userId = navigation.getParam('loginUser');

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'JobDetailScreen',
                        params: {
                            jobid: item?.id,
                            loginUser: userId,
                        },
                    }),
                );
            }}>
            <View style={styles.img}>
                <View style={styles.jobType}>
                    <CustomText size={12} color="#fff" text={item?.job_type} />
                </View>
                <Images.Logo />
            </View>
            <View style={styles.content}>
                <View style={[globalStyle.betweenCenter]}>
                    <CustomText text={item?.job_title} size={18} weight="700" />
                    <View style={{ alignItems: 'center' }}>
                        <Text>{renderStars()}</Text>
                        <CustomText text="Review" size={10} weight="500" />
                    </View>
                </View>
                <CustomText
                    text={
                        item?.job_description.length > 45
                            ? `${item?.job_description.substr(0, 45)}...`
                            : item?.job_description
                    }
                    customStyle={{ marginTop: moderateScale(5) }}
                    weight="500"
                />
                <CustomText
                    text={item?.location}
                    size={12}
                    customStyle={{ marginTop: moderateScale(5) }}
                    color={Colors.gray_font}
                />
                <CustomText
                    text={item?.pay_range}
                    customStyle={{ marginTop: moderateScale(5) }}
                    weight="500"
                />
            </View>
        </Pressable>
    );
};

export default SearchCareer;

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
