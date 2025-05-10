import { FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
// import Container from '../../../components/Container'
// import CustomHeader1 from '../../../components/Customs/Header/CustomHeader1'
// import Images from '../../../utils/Images'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
// import { moderateScale, screenHeight, screenWidth, verticalScale } from '../../../components/Matrix/Matrix'

// 
import { globalStyle } from '../../utils/GlobalStyle'
import CustomIcon from '../../components/Customs/CustomIcon'
import CustomText from '../../components/Customs/CustomText'
import { moderateScale, screenHeight, screenWidth, verticalScale } from '../../components/Matrix/Matrix'
import CustomHeader2 from '../../components/Customs/Header/CustomHeader2'
import Container from '../../components/Container'
import Images from '../../utils/Images'
import makeApiRequest from '../../utils/ApiService'
import { BASE_URL } from '../../utils/api'
import { useSelector } from 'react-redux'
import Colors from '../../utils/Colors'
import CustomButton from '../../components/Customs/CustomButton'
import { LineChart } from 'react-native-chart-kit'
import CustomModal from '../../components/Customs/CustomModal'


const Profile = () => {

  const { user } = useSelector((state: any) => state?.user);
  const userOptionScreen: any = [
    {
      id: 1,
      label: 'Course',
      svg: Images.Course,
      route: "OwnCourse",
    },
    // {
    //   id: 2,
    //   label: 'Franchise',
    //   route: "UserFranchise",
    //   // handleNav: () => navigation.navigate('UserFranchise'),
    //   svg: Images.Franchise1
    // },
    // {
    //   id: 3,
    //   label: 'Job List',
    //   route: "UserJob",
    //   iconType: "Feather",
    //   iconName: "users"
    // },
    {
      id: 4,
      label: 'Retreat',
      route: "OwnRetreat",
      svg: Images.Retreat
    },
    {
      id: 5,
      label: 'Order',
      // handleNav: () => navigation.navigate('OrderTopNavigation'),
      route: "OrdersHistory",
      iconType: "Feather",
      iconName: "shopping-cart"
    },
    // {
    //   id: 6,
    //   label: 'Review',
    //   handleNav: () => navigation.navigate('ReviewListScreen'),
    //   route: "WrittenReview",
    //   svg: Images.Review
    // },
    // {
    //   id: 7,
    //   label: 'Profile',
    //   // handleNav: () => navigation.navigate('Profile'),
    //   route: "Profile",
    //   iconType: "Feather",
    //   iconName: "user"
    // },
    {
      id: 10,
      label: 'Payment',
      iconType: "MaterialIcons",
      iconName: "payment",
      route: "Payments",
      direct: true,
    },
    {
      id: 8,
      label: 'Get Rewards',
      iconType: "AntDesign",
      iconName: "gift",
      route: "Rewards",
      direct: true,
    },
    {
      id: 9,
      label: 'Coupons',
      iconType: "FontAwesome",
      iconName: "ticket",
      route: "Coupons",
      direct: true,
    },
    {
      id: 10,
      label: 'Studios',
      iconType: "Ionicons",
      iconName: "barbell-outline",
      route: "Studios",
      direct: true,
    },

  ];

  const [barContent, setbarContent] = useState('Course');
  const [barTypeContent, setbarTypeContent] = useState('Clicks');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [optionLabel, setOptionLabel] = useState('');
  const [dates, setDates] = useState<[]>([]);
  const [graphData, setGraphData] = useState<[]>([]);
  const [showModalBarContent, setShowModalBarContent] = useState(false);
  const [showModalBarType, setShowModalBarType] = useState(false);
  const [rawContent, setRawContent] = useState<any>(null);
  const [totalClicks, setTotalClicks] = useState<number>(0)

  useFocusEffect(
    useCallback(() => {
      CourseGraph();
    }, [barTypeContent, barContent]),
  );

  const CourseGraph = async () => {
    try {
      const row = {
        user_id: user?.id,
      };
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: `${barContent.toLowerCase()}-click-and-impression`,
        method: "POST",
        data: row
      });
      if (response.monthlyClickCounter) {
        const apiData = response;
        setRawContent(response);
        const data: any =
          barTypeContent === 'Clicks'
            ? apiData?.monthlyClickCounter
            : barTypeContent === 'Impressions'
              ? apiData.monthlyImpressionCounter
              : null;

        const dates: string[] = Object.keys(data);
        const graphDatas: number[] = Object.values(data);
        setDates(dates);
        setGraphData(graphDatas);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log("==== rawContent data ====", rawContent);


  const getCurrentYearMonth = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month to ensure two digits
    const year = date.getFullYear();
    return `${year}-${month}`; // Return as YYYY-MM
  };

  const navigation = useNavigation();
  return (
    <Container>
      <CustomHeader2 title="Profile" isMore={true} iconType="Feather" iconName="settings" handleMore={
        () => {
          navigation.navigate('Settings')
        }
      } />

      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} >
        <View style={{ marginTop: moderateScale(15) }} >
          <View style={[globalStyle.betweenCenter]}>
            <View style={[globalStyle.betweenCenter, { flex: 1, width: "100%" }]}>
              <CustomButton
                title={barTypeContent}
                customStyle={{ width: '48%' }}
                onPress={() => {
                  setShowModalBarType(true);
                }}
                radius={10}
              />
              <CustomButton
                bg={Colors.orange}
                radius={10}
                title={barContent}
                customStyle={{ width: '48%', marginLeft: moderateScale(3) }}
                onPress={() => {
                  setShowModalBarContent(true);
                }}
              />
            </View>
          </View>

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
            height={screenHeight * .32}
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


          <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(10) }]}>
            <View style={[globalStyle.row]}>
              <View
                style={{
                  width: moderateScale(10),
                  height: moderateScale(10),
                  backgroundColor: '#ff0000',
                  borderRadius: moderateScale(10),
                }}
              />
              <CustomText
                size={13}
                customStyle={{ marginLeft: moderateScale(5) }}
                text="30 Subscribes"
                weight="500"
              />
            </View>

            <View style={[globalStyle.row]}>
              <View
                style={{
                  width: moderateScale(10),
                  height: moderateScale(10),
                  backgroundColor: Colors?.activeRadio,
                  borderRadius: moderateScale(10),
                }}
              />
              <CustomText
                size={13}
                customStyle={{ marginLeft: moderateScale(5) }}
                text={`${Object.values(rawContent?.monthlyClickCounter || {}).reduce((acc, item) => acc + item, 0)
                  } Clicks`}
                weight="500"
              />

            </View>

            <View style={[globalStyle.row]}>
              <View
                style={{
                  width: moderateScale(10),
                  height: moderateScale(10),
                  backgroundColor: Colors?.orange,
                  borderRadius: moderateScale(10),
                }}
              />
              <CustomText
                size={13}
                customStyle={{ marginLeft: moderateScale(5) }}
                text={`${Object.values(rawContent?.monthlyImpressionCounter || {}).reduce((acc: any, item: any) => acc + item, 0)
                  } Impressions`}
                weight="500"
              />
            </View>
          </View>

          {
            <CustomModal
              iscenter={true}
              visible={showModalBarType}
              containerStyle={{ paddingVertical: moderateScale(10) }}
              onDismiss={() => {
                setShowModalBarType(false);
              }}>
              <CustomText
                text="Select Module"
                weight="600"
                size={16}
                customStyle={{
                  textAlign: 'center',
                  marginBottom: moderateScale(10),
                }}
              />

              <CustomButton
                title="Clicks"
                bg={barTypeContent === 'Clicks' ? Colors.orange : '#000'}
                onPress={() => {
                  setbarTypeContent('Clicks');
                  setShowModalBarType(false);
                }}
                customStyle={{ marginBottom: moderateScale(10) }}
              />
              <CustomButton
                bg={
                  barTypeContent === 'Impressions' ? Colors.orange : '#000'
                }
                customStyle={{ marginBottom: moderateScale(10) }}
                title="Impressions"
                onPress={() => {
                  setbarTypeContent('Impressions');
                  setShowModalBarType(false);
                }}
              />
            </CustomModal>
          }
          {
            <CustomModal
              iscenter={true}
              visible={showModalBarContent}
              containerStyle={{ paddingVertical: moderateScale(10) }}
              onDismiss={() => {
                setShowModalBarContent(false);
              }}>
              <CustomText
                text="Select Module"
                weight="600"
                size={16}
                customStyle={{
                  textAlign: 'center',
                  marginBottom: moderateScale(10),
                }}
              />
              <CustomButton
                title="Course"
                bg={barContent === 'Course' ? Colors.orange : '#000'}
                onPress={() => {
                  setbarContent('Course');
                  setShowModalBarContent(false);
                }}
                customStyle={{ marginBottom: moderateScale(10) }}
              />

              <CustomButton
                bg={barContent === 'Franchise' ? Colors.orange : '#000'}
                customStyle={{ marginBottom: moderateScale(10) }}
                title="Franchise"
                onPress={() => {
                  setbarContent('Franchise');
                  setShowModalBarContent(false);
                }}
              />

              <CustomButton
                bg={barContent === 'Carrier' ? Colors.orange : '#000'}
                customStyle={{ marginBottom: moderateScale(10) }}
                title="Carrier"
                onPress={() => {
                  setbarContent('Carrier');
                  setShowModalBarContent(false);
                }}
              />

              <CustomButton
                bg={barContent === 'ReTreat' ? Colors.orange : '#000'}
                customStyle={{ marginBottom: moderateScale(10) }}
                title="ReTreat"
                onPress={() => {
                  setbarContent('ReTreat');
                  setShowModalBarContent(false);
                }}
              />
            </CustomModal>
          }

        </View>

        <FlatList
          data={userOptionScreen}
          numColumns={3}
          // style={{justifyContent:"flex-end"}}
          keyExtractor={(item: any) => item?.id.toString()}
          contentContainerStyle={{ alignSelf: "center", marginTop: moderateScale(10), justifyContent: "flex-end", flex: 1, marginBottom: moderateScale(100) }} // Add padding to the container
          columnWrapperStyle={{ gap: 10 }} // Creates gaps between columns without space-between
          // ListHeaderComponent={}
          renderItem={({ item }: any) => {
            const Svg = item.svg;
            return (
              <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate(item?.route)}
              >
                <View style={styles.icon}>
                  {Svg && <Svg width={moderateScale(35)} height={moderateScale(35)} />}
                  {item?.iconType && <CustomIcon type={item?.iconType} size={30} name={item?.iconName} />}
                </View>
                <CustomText text={item?.label} />
              </Pressable>
            );
          }}
        />
      </ScrollView>

    </Container>
  )
}

export default Profile

const styles = StyleSheet.create({
  row_container: {
    width: screenWidth * .28,
    height: screenHeight * .13,
    // padding:20,
    opacity: 458,
    elevation: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
    alignSelf: 'center',
  },
  icon: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: moderateScale(100),
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(10),
  },
})