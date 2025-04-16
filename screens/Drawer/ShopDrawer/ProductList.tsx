import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { FC, useCallback, useState } from 'react'
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { DEFAULT_URL, POST_PRODUCT_LIST } from '../../../utils/api';
import Container from '../../../components/Container';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import { screenHeight, screenWidth } from '../../../components/Matrix/Matrix';

interface Props{
    navigation:any,
    route:any
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
            // const response = await getMethod(
            //   `products?searchCriteria[filter_groups][0][filters][0][field]=type_id&searchCriteria[filter_groups][0][filters][0][value]=simple&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=category_id&searchCriteria[filter_groups][1][filters][0][value]=6&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[filter_groups][2][filters][0][field]=visibility&searchCriteria[filter_groups][2][filters][0][value]=4&fields=items[id,sku,name,price,description,custom_attributes[short_description,special_price,],media_gallery_entries[types,file]]&searchCriteria[filter_groups][1][filters][0][value]=${categoryId}`,
            // );

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
                <ActivityIndicator style={{flex:1, backgroundColor:"#ffffff"
                }} size={25} color="black" />
            ) : (
                <FlatList
                    data={product}
                    numColumns={2}
                    keyExtractor={(item:any) => item.id.toString()}
                    // contentContainerStyle={styles.gridContainer}
                    // refreshControl={
                    //     <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                    // }
                    renderItem={({ item }) => {
                        // Fetch primary image or fallback to the first image
                        const primaryImage =
                            item.media_gallery_entries?.find((entry:any) =>
                                entry.types?.includes('image'),
                            ) || item.media_gallery_entries?.[0];

                        const imageUrl = primaryImage
                            ? `https://gripkart.com/pub/media/catalog/product${primaryImage.file}`
                            : 'https://via.placeholder.com/150'; // Fallback if no image found

                        // Dynamically find special_price from custom_attributes
                        const specialPriceEntry:any = Object.values(
                            item.custom_attributes || {},
                        ).find((attr:any) => attr.attribute_code === 'special_price');
                        const specialPrice:any = specialPriceEntry
                            ? specialPriceEntry.value
                            : null;

                        return (
                            <Pressable
                                style={styles.productCard}
                                onPress={() =>
                                    sentFun(item, parseFloat(specialPrice).toFixed(2))
                                }>
                                <Image source={{ uri: imageUrl }} style={styles.productImage} />
                                <Text style={styles.productName}>
                                    {item.name.length > 30
                                        ? `${item.name.substring(0, 30)}...`
                                        : item.name}
                                </Text>

                                {specialPrice && (
                                    <Text style={styles.productSpecialPrice}>Rs{item.price}</Text>
                                )}
                                <Text style={styles.productPrice}>
                                    Rs {parseFloat(specialPrice).toFixed(2)}
                                </Text>
                            </Pressable>
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
        width: screenWidth*.45,
        justifyContent: 'center',
    },
    productImage: {
        width: screenWidth*.35,
        height: screenHeight*.25,
        resizeMode: 'contain',
    },
    productName: {
        width: screenWidth*.35,
        minHeight: screenHeight*.03,
        lineHeight: 15,

        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        letterSpacing: 0.5,
        fontSize:15,
        marginBottom: 10,
    },
    productPrice: {
        width: screenWidth*.4,

        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        fontSize: 15,
    },
    productSpecialPrice: {
        width:screenWidth*.4,
        color: 'gray',
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
});