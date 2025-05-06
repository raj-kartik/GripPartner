import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Container from '../../components/Container';
import Images from '../../utils/Images';
import CustomText from '../../components/Customs/CustomText';
import ShopHeader1 from '../../components/Customs/Header/ShopHeader1';
import {
  DEFAULT_URL,
  GET_MASSAGE_BANNER,
  GET_MASSAGE_PRODUCT,
  GET_MEDITATION_BANNER,
  GET_MEDITATION_PRODUCT_LIST,
  GET_SPORTS_BANNER,
  GET_SPORTS_PRODUCT,
  GET_YOGA_ACCESSORIES,
  GET_YOGA_ACCESSORIES_PRODUCT,
  GET_YOGA_MAT_BANNER,
} from '../../utils/api';
import makeApiRequest from '../../utils/ApiService';
import {
  moderateScale,
  screenHeight,
  screenWidth,
} from '../../components/Matrix/Matrix';
import SubHeader from '../../components/Customs/Header/SubHeader1';
import SpecialCard from '../../components/Cards/SpecialCard';
import Colors from '../../utils/Colors';
import { globalStyle } from '../../utils/GlobalStyle';

const bannerEndpoints = [
  GET_YOGA_MAT_BANNER,
  GET_MEDITATION_BANNER,
  GET_MASSAGE_BANNER,
  GET_YOGA_ACCESSORIES,
  GET_SPORTS_BANNER,
];

const categoryEndpoints = [
  GET_YOGA_ACCESSORIES_PRODUCT,
  GET_MEDITATION_PRODUCT_LIST,
  GET_MASSAGE_PRODUCT,
  GET_YOGA_ACCESSORIES_PRODUCT,
  GET_SPORTS_PRODUCT,
];

const Section = React.memo(({ index, banner, products, loading }: any) => {
  return (
    <View style={{ height: screenHeight }}>
      {loading ? (
        // <ActivityIndicator size="large" style={{ marginTop: 20 }}  />
        <View />
      ) : (
        <>
          {banner && banner.length > 0 && (
            <FlatList
              data={banner}
              horizontal
              keyExtractor={(_, i) => `banner-${index}-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginVertical: moderateScale(10) }}
              renderItem={({ item }: any) => (
                <Image
                  source={{ uri: item?.url }}
                  style={{
                    width: screenWidth * 0.92,
                    marginRight: 10,
                    borderRadius: moderateScale(10),
                    backgroundColor: '#ccc',
                  }}
                  resizeMode="cover"
                />
              )}
            />
          )}

          {products?.products && products?.products.length > 0 ? (
            <View style={{ marginTop: moderateScale(10) }}>
              <View style={[globalStyle.betweenCenter]}>
                <CustomText text={products?.name} weight="700" size={22} />
                <Pressable>
                  <CustomText
                    size={14}
                    text="View all"
                    weight="500"
                    color={Colors.gray_font}
                  />
                </Pressable>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                numColumns={2}
                data={products?.products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SpecialCard item={item} />}
              />
            </View>
          ) : (
            <View />
          )}
        </>
      )}
    </View>
  );
});

const Products = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [bannerMap, setBannerMap] = useState<any>({});
  const [productMap, setProductMap] = useState<any>({});
  const [loadingMap, setLoadingMap] = useState<any>({});

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const preloadBuffer = 2; // Preload 2 sections ahead

  const fetchSectionData = async (index: number, force = false) => {
    if (
      (!force && (bannerMap[index] || productMap[index] || loadingMap[index])) ||
      index >= categoryEndpoints.length
    ) {
      return; // Already fetched or out of bounds
    }

    setLoadingMap((prev: any) => ({ ...prev, [index]: true }));

    try {
      const [bannerRes, productRes]: any = await Promise.all([
        makeApiRequest({
          baseUrl: DEFAULT_URL,
          url: bannerEndpoints[index],
          method: 'GET',
        }),
        makeApiRequest({
          baseUrl: DEFAULT_URL,
          url: categoryEndpoints[index],
          method: 'GET',
        }),
      ]);

      if (!bannerRes.error) {
        setBannerMap((prev: any) => ({ ...prev, [index]: bannerRes.data }));
      }

      if (!productRes.error) {
        setProductMap((prev: any) => ({ ...prev, [index]: productRes.data }));
      }
    } catch (error) {
      console.error(`Error loading data for section ${index}`, error);
    } finally {
      setLoadingMap((prev: any) => ({ ...prev, [index]: false }));
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    viewableItems.forEach(({ index }: any) => {
      if (index !== null) {
        fetchSectionData(index);
        for (let i = 1; i <= preloadBuffer; i++) {
          fetchSectionData(index + i);
        }
      }
    });
  });

  const renderItem = useCallback(
    ({ _, index }) => {
      const banner = bannerMap[index];
      const products = productMap[index];
      const loading = loadingMap[index];

      return (
        <Section
          index={index}
          banner={banner}
          products={products}
          loading={loading}
        />
      );
    },
    [bannerMap, productMap, loadingMap]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Only refresh sections that are already loaded (existing keys in bannerMap/productMap)
    const loadedIndices = Object.keys(bannerMap)
      .map((key) => parseInt(key))
      .filter((index) => !isNaN(index));

    try {
      const refreshPromises = loadedIndices.map((index) =>
        fetchSectionData(index, true) // Pass 'force' to re-fetch
      );
      await Promise.all(refreshPromises);
    } catch (err) {
      console.error('Error refreshing loaded sections', err);
    }

    setRefreshing(false);
  }, [bannerMap]); // Depend on bannerMap to detect which indices were loaded

  return (
    <Container>
      <ShopHeader1 navigation={navigation} />
      <FlatList
        data={categoryEndpoints}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View style={{ marginBottom: moderateScale(100) }} />
        }
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
      />
    </Container>
  );
};


export default Products;

const styles = StyleSheet.create({});
