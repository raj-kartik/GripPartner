import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomText from '../../components/Customs/CustomText';
import Images from '../../utils/Images';
import { moderateScale, screenHeight } from '../../components/Matrix/Matrix';
import Colors from '../../utils/Colors';
import CustomIcon from '../../components/Customs/CustomIcon';
import { useFocusEffect } from '@react-navigation/native';
import makeApiRequest from '../../utils/ApiService';

const RetreatReview = ({ retreatid }: any) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [allReview, setAllReview] = useState<[]>([]);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useFocusEffect(
        useCallback(() => {
            ReviewList();
        }, []),
    );

    const ReviewList = async () => {
        try {
            setLoading(true);
            const row = {
                retreat_id: retreatid,
            };
            const response: any = await makeApiRequest({ url: 'retreat-review-list', method: "POST", data: row })

            if (response?.all_reviews) {
                // console.log(response.data, 'gg');
                setAllReview(response.all_reviews);
                setData(response.review);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error');
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                // <Icon
                //   key={i}
                //   name={i <= rating ? 'star' : 'star-outline'}
                //   type="material"
                //   color="orange"
                //   size={15}
                // />,
                <CustomIcon type='AntDesign' name={i <= rating ? 'star' : 'staro'} color="orange" />
            );
        }
        return stars;
    };

    const handleShowMoreReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    const reviewsToShow = showAllReviews ? data : data.slice(0, 5);
    return <>
        <View style={[styles.container, {}]}>
            <CustomText
                size={16}
                weight="600"
                text={`Customer reviews (${allReview.reviewCount})`}
            />
            <Text>{renderStars(allReview.averageRating)}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            {reviewsToShow.map((item: any) => {

                return (
                    <View style={[styles.container]} key={item.id}>
                        <CustomText
                            text={item?.time}
                            color={Colors.gray_font}
                            size={12}
                            customStyle={{
                                position: 'absolute',
                                top: moderateScale(10),
                                right: moderateScale(10),
                            }}
                        />
                        <View style={styles.containerRow}>
                            {item?.image ? (
                                <Image
                                    style={{
                                        width: moderateScale(50),
                                        height: moderateScale(50),
                                        borderRadius: moderateScale(100),
                                        backgroundColor: 'red',
                                    }}
                                    source={{ uri: item?.image }}
                                />
                            ) : (
                                <View
                                    style={{
                                        width: moderateScale(50),
                                        height: moderateScale(50),
                                        borderRadius: moderateScale(100),
                                        backgroundColor: 'red',
                                    }}>
                                    <Images.LogoW width={30} height={30} />
                                </View>
                            )}

                            <View style={styles.row}>
                                <View style={{ width: '75%' }}>
                                    <CustomText
                                        text={item?.name || 'No Name'}
                                        size={15}
                                        weight="500"
                                    />
                                    <Text style={styles.text1}>{renderStars(item.rating)}</Text>
                                    <CustomText text={item?.title} weight="600" />
                                </View>
                            </View>
                        </View>
                        {item['review Image'] ? (
                            <Image
                                source={{ uri: item['review Image'] }}
                                style={styles.image}
                            />
                        ) : null}
                    </View>
                );
            })}

            {data.length > 5 && (
                <Pressable style={styles.tabBottom} onPress={handleShowMoreReviews}>
                    <Text style={styles.text}>
                        {showAllReviews ? 'Show Less' : 'Show All Reviews'}
                    </Text>
                </Pressable>
            )}
        </ScrollView>
    </>
}

export default RetreatReview

const styles = StyleSheet.create({
    image: {
        width: "80%",
        height: screenHeight * .2,
        resizeMode: 'contain',
        marginBottom: moderateScale(20),
    },
    text: {
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
    },
    container: {
        paddingVertical: moderateScale(10),
        backgroundColor: '#f7f7f7',
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(10),
        elevation: 5,
        width: '96%',
        alignSelf: 'center',
        marginBottom: moderateScale(5),
    },
    containerRow: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 20,
    },
    tabBottom: {
        width: '100%',
        height: screenHeight * 0.07,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        elevation: 1,
        borderColor: 'white',
        borderWidth: 2.5,
        position: 'static',
        marginBottom: 10,
        alignSelf: 'center',
    },
    row: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text1: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Roboto-Black',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text2: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        marginBottom: 10,
        opacity: 5,
        marginLeft: -10,
        textAlign: 'justify',
    },
    text3: {
        width: "80%",
        color: 'black',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        marginTop: -5,
        // marginLeft: 10,
    },
})