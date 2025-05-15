import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { FC, useCallback, useState } from 'react'
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { DEFAULT_URL, POST_PRODUCT_LIST } from '../../../utils/api';
import Container from '../../../components/Container';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import { moderateScale, screenHeight, screenWidth } from '../../../components/Matrix/Matrix';
import SpecialCard from '../../../components/Cards/SpecialCard';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface Props {
    navigation: any,
    route: any
}
export const ProductList: FC<Props> = ({ navigation, route }) => {
    const { categoryId } = route.params;
    const [product, setProduct] = useState<[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState([]);

    // console.log("---- category in the productList -----",categoryId);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProduct();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchProduct();
        }, []),
    );

    const fetchProduct = async () => {
        setLoading(true);
        try {

            const formData = new FormData();
            formData.append('category_id', categoryId);

            const response = await axios({
                baseURL: DEFAULT_URL, // Base URL of the API
                url: POST_PRODUCT_LIST, // Endpoint URL
                method: 'POST', // HTTP method
                data: formData, // FormData object
                headers: {
                    'Content-Type': 'multipart/form-data', // Content type for file uploads
                },
            });


            console.log("==== response in the product list ====", response);


            // console.log('Response:', response);
            if (response.status === 200) {
                setProduct(response.data?.data?.products);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    console.log("==== product in the special ====", product);


    const sentFun = (item: any, specialPrice: any) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Description',
                params: {
                    sku: item.sku,
                    specialPrice: specialPrice,
                },
            }),
        );
    };

    return (
        <Container>
            <CustomHeader2 title="Product List" />
            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    keyExtractor={item => item}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View
                            style={styles.cardContainer}
                        >

                            <ShimmerPlaceholder
                                style={{
                                    width: "100%",
                                    height: "60%"
                                    // height: moderateScale(120),
                                }}
                                LinearGradient={LinearGradient}
                                shimmerStyle={{
                                    alignSelf: 'center',
                                    borderRadius: moderateScale(5),
                                    marginTop: moderateScale(0),
                                }}
                                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                                duration={1500}
                            />

                            <ShimmerPlaceholder
                                style={{ marginHorizontal: 10, width: "100%", height: 30 }}
                                LinearGradient={LinearGradient}
                                shimmerStyle={{
                                    alignSelf: 'center',
                                    marginTop: moderateScale(5),
                                    borderRadius: moderateScale(3),
                                }}
                                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                                duration={1500}
                            />

                            <ShimmerPlaceholder
                                style={{ margin: moderateScale(10), marginHorizontal: 10, width: "100%", height: 30 }}
                                LinearGradient={LinearGradient}
                                shimmerStyle={{
                                    alignSelf: 'center',
                                    marginTop: moderateScale(5),
                                    borderRadius: moderateScale(3),
                                }}
                                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                                duration={1500}
                            />
                        </View>
                    )}
                />
            ) : (
                <FlatList
                    data={product}
                    numColumns={2}
                    keyExtractor={(item: any) => item.id.toString()}
                    // contentContainerStyle={styles.gridContainer}
                    // refreshControl={
                    //     <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                    // }
                    renderItem={({ item }) => {
                        return (
                            <SpecialCard item={item} />
                        );
                    }}
                />
            )}

            {/* Product Grid */}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems:'flex-start'
    },
    header: {
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    gridContainer: {
        paddingVertical: 10,
    },
    productCard: {
        flex: 0.7,
        margin: 15,
        // marginHorizontal:15,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        padding: 10,
        elevation: 5,
        opacity: 1,
        width: screenWidth * .45,
        justifyContent: 'center',
    },
    productImage: {
        width: screenWidth * .35,
        height: screenHeight * .25,
        resizeMode: 'contain',
    },
    productName: {
        width: screenWidth * .35,
        minHeight: screenHeight * .03,
        lineHeight: 15,

        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        letterSpacing: 0.5,
        fontSize: 15,
        marginBottom: 10,
    },
    productPrice: {
        width: screenWidth * .4,

        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        fontSize: 15,
    },
    productSpecialPrice: {
        width: screenWidth * .4,
        color: 'gray',
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
    cardContainer: {
        width: screenWidth * 0.415,
        height: moderateScale(200),
        borderRadius: moderateScale(10),
        backgroundColor: 'white',
        elevation: 5,
        margin: moderateScale(10),
        padding: moderateScale(5),
    },
});