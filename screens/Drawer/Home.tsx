import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View, Image, RefreshControl } from 'react-native'
import React, { FC, use, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getCourse } from '../../redux/Slice/CourseSlice';
import Container from '../../components/Container';
import HomeHeader1 from '../../components/Customs/Header/HomeHeader1';
import { moderateScale, screenWidth } from '../../components/Matrix/Matrix';
import SubHeader from '../../components/Customs/Header/SubHeader1';
import CourseCard1 from '../../components/Cards/CourseCard1';
import RetreatCard1 from '../../components/Cards/RetreatCard1';
import { getRetreat } from '../../redux/Slice/RetreatSlice';
import makeApiRequest from '../../utils/ApiService';
import { BASE_URL, GET_BANNER_LIST } from '../../utils/api';
import ShopCard1 from '../../components/Cards/ShopCard1';
import { fetchLocation } from '../../redux/Slice/LiveSlice';
import { featureList } from '../../redux/Slice/FeatureSlice';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import Images from '../../utils/Images';
import { globalStyle } from '../../utils/GlobalStyle';
import CustomText from '../../components/Customs/CustomText';
import Colors from '../../utils/Colors';
import IsKycCard from '../../components/Cards/IsKycCard';
import { getWalletBalance } from '../../redux/Slice/WalletSlice';
import { addToCart } from '../../redux/Slice/AddToCartSlice';
import { getStudioList } from '@redux/Slice/StudioSlice';
import CourseSkeleton from '@components/Skeleton/CourseSkeleton';
import RetreatSkeleton from '@components/Skeleton/RetreatSkeleton';
import ShopSkeleton from '@components/Skeleton/ShopSkeleton';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { OneSignal } from 'react-native-onesignal';
import { userDetail } from '@redux/Slice/UserSlice/UserSlice';
import { trainerList } from '@redux/Slice/TrainerSlice';

const getCurrentYearMonth = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month to ensure two digits
  const year = date.getFullYear();
  return `${year}-${month}`; // Return as YYYY-MM
};

const Home = ({ navigation }: any) => {
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  const { course, loading: courseLoading } = useSelector((state: any) => state?.course);
  const { retreat, loading: retreatloading } = useSelector((state: any) => state?.retreat);
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<[]>([]);
  const { location } = useSelector((state: any) => state?.location)
  const [banner, setBanner] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [dates, setDates] = useState<[]>([]);
  const [graphData, setGraphData] = useState<[]>([]);
  const [barContent, setbarContent] = useState('Course');
  const [barTypeContent, setbarTypeContent] = useState('Clicks');
  const { user } = useSelector((state: any) => state?.user);
  const [refreshing, setRefreshing] = useState(false);


  // console.log("--- user in the home page ---", user);

  useEffect(() => {
    const playerId = async () => {
      OneSignal.User.pushSubscription.addEventListener('change', (pushSubscription) => {
        const playerId = pushSubscription.current.id;
        if (playerId) {
          console.log('OneSignal Player ID:', playerId);
          // Use or store the playerId as needed
        } else {
          console.log('Player ID not yet available');
        }
      });
    }

    playerId();
  })


  useEffect(() => {
    CourseGraph();
  }, [barTypeContent, barContent]);

  useFocusEffect(
    useCallback(() => {
      CourseListFeature();
      ShopList();
      fetchRetreatCourse();
    }, [])
  );

  const fetchRetreatCourse = async () => {
    await dispatch(getCourse({ id: user?.id, studio_id: "" }));
    await dispatch(getRetreat(user?.id));
    await dispatch(fetchLocation({}));
    await dispatch(getWalletBalance(user?.id));
    await dispatch(getStudioList(user?.id));
    await BannerList();
    await dispatch(addToCart());
    await dispatch(trainerList(user?.id))
    // await dispatch(userDetail());
  }
  const ShopList = async () => {
    try {
      setLoading(true);
      // const response: any = await getMethod('home-shop-product-list');
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: "home-shop-product-list",
        method: "GET"
      });


      if (response.response.length > 0) {
        // console.log('--- home-shop-list ----', response.data.response);
        setShop(response.response);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log('error in home tsx', error);
    }
  };

  // CourseListFeature();

  useEffect(() => {
    if (!banner || banner.length === 0) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % banner.length;

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banner]);

  const BannerList = async () => {
    try {
      const response: any = await makeApiRequest({
        method: 'GET',
        url: GET_BANNER_LIST,
      });
      // console.log('---- response for the banner list ----', response?.response);
      if (response?.response.length > 0) setBanner(response?.response);
    } catch (err) {
      console.log('Error in the Home page Banner:', err);
    }
  };

  const featureListApi = [
    {
      id: 1,
      api: 'course-list',
    },
    {
      id: 2,
      api: 'trainer-list',
    },
    {
      id: 2,
      api: 'retreat-list',
    },
  ];
  const CourseListFeature = async () => {
    for (let i = 0; i < featureListApi.length; i++) {
      await dispatch(
        featureList({
          lat: location?.latitude,
          long: location?.longitude,
          listOf: featureListApi[i].api,
        }),
      );
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      CourseListFeature();
      ShopList();
      fetchRetreatCourse();
      CourseGraph();
      setRefreshing(false);
    }, 2000);
  }, []);


  // console.log("==== user id ====", user);


  // if (loading)
  //   return <ActivityIndicator size="large" style={{ flex: 1, backgroundColor: "#fff" }} color="#000" />

  const CourseGraph = async () => {
    try {
      const row = {
        user_id: user?.id,
      };
      // const response: any = await postMethod(
      //   `${barContent.toLowerCase()}-click-and-impression`,
      //   row,
      // );

      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: `${barContent.toLowerCase()}-click-and-impression`,
        method: "POST",
        data: row
      });


      // console.log("==== response in the click barcontent ====", response);


      if (response.monthlyClickCounter) {
        const apiData = response;

        const data: any =
          barTypeContent === 'Clicks'
            ? apiData?.monthlyClickCounter
            : barTypeContent === 'Impressions'
              ? apiData.monthlyImpressionCounter
              : null;

        // console.log('===== api data in the response data ===', data);
        const dates: string[] = Object.keys(data);
        const graphDatas: number[] = Object.values(data);
        setDates(dates);
        setGraphData(graphDatas);
      }
    } catch (error) {
      console.error(error);
    }
  };


  // console.log("==== graph data ====", user);


  return (
    <Container>
      {
        user?.is_registred && <HomeHeader1 />
      }


      {/* <Images.Logo width={100} height={100} stroke="#000" style={{ backgroundColor: "red" }} /> */}
      {
        user?.is_registred ? <ScrollView
          style={{ marginTop: moderateScale(20), paddingBottom: moderateScale(100) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          {
            !graphData ? (
              <ShimmerPlaceholder LinearGradient={LinearGradient} shimmerStyle={{ borderRadius: 10 }}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500} style={{ width: screenWidth * .95, height: moderateScale(200), }} />
            ) : (
              <LineChart
                data={{
                  labels: dates && dates.length > 0 ? dates : [getCurrentYearMonth()], // Default label if dates is empty
                  datasets: [
                    {
                      data: graphData && graphData.length > 0 ? graphData : [0], // Default data if graphData is empty
                    },
                  ],
                }}
                width={screenWidth * 0.95}
                height={moderateScale(200)}
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            )
          }


          {
            courseLoading ? <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[1, 2, 3]}
              contentContainerStyle={{ columnGap: moderateScale(10), marginLeft: moderateScale(5) }}
              keyExtractor={(item, index) => item}
              renderItem={({ item }: any) => {
                return <CourseSkeleton />
              }}
            /> : (
              <>
                {course && course.length > 0 && (
                  <View style={{ marginBottom: moderateScale(20), marginTop: moderateScale(10) }}>
                    <SubHeader
                      title="My Courses"
                      handlePress={() => {
                        // console.log('--click in the courses ---');
                        navigation.navigate('OwnCourse');
                      }}
                      isMore={true}
                    />
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={course.slice(0, 3)}
                      keyExtractor={(item: any) => item?.id}
                      renderItem={({ item }) => {
                        return <CourseCard1 item={item} navigation={navigation} />;
                      }}
                    />
                  </View>
                )}</>
            )
          }

          {
            retreatloading ? <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[1, 2, 3]}
              keyExtractor={(item, index) => item}
              renderItem={({ item }: any) => {
                return <RetreatSkeleton />
              }}
            /> : (
              <>
                {retreat && retreat.length > 0 && (
                  <View style={{ marginBottom: moderateScale(20) }}>
                    <SubHeader
                      title="Own Retreats"
                      handlePress={() => {
                        // console.log('--click in the courses ---');
                        navigation.navigate('OwnRetreat');
                      }}
                      isMore={true}
                    />
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={retreat.slice(0, 3)}
                      keyExtractor={(item: any) => item?.id}
                      renderItem={({ item }) => {
                        // console.log("==== item in the retreat ====", item);

                        return <RetreatCard1 item={item} navigation={navigation} />;
                      }}
                    />
                  </View>
                )}</>
            )
          }


          {
            loading ? <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item}
              renderItem={({ item }: any) => {
                return <ShopSkeleton />
              }}
            /> : (
              <>
                {shop && shop.length > 0 && (
                  <View style={{ marginBottom: moderateScale(20) }}>
                    <SubHeader
                      title="Shop Now"
                      handlePress={() => {
                        console.log('--- click in teh retreat');
                        navigation.navigate('ECom');
                      }}
                      isMore={true}
                    />

                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={shop.slice(0, 3)}
                      keyExtractor={(item: any) => item?.id}
                      renderItem={({ item }) => <ShopCard1 item={item} />}
                    />
                  </View>
                )}
              </>
            )
          }




          <View style={{ marginBottom: moderateScale(70) }} />
        </ScrollView> : (
          <IsKycCard />
        )
      }

    </Container>
  )
}

export default Home

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(5),
  },
  dotRef: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: '#ccc',
    marginHorizontal: moderateScale(2),
  },
  activeDot: {
    backgroundColor: '#000',
    width: moderateScale(20),
  },
})