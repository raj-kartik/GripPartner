import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native'
import React, { FC, useCallback, useState } from 'react'
import Container from '../../../components/Container'
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import Colors from '../../../utils/Colors';
import CustomText from '../../../components/Customs/CustomText';
import makeApiRequest from '../../../utils/ApiService';
import { BASE_URL, TRAINER_RETREAT_DETAILS } from '../../../utils/api';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomIcon from '../../../components/Customs/CustomIcon';
import TrainerDashboard from '../../../components/TrainingDashboard';
import ImageCard from '../../../components/ImageCard';
import { MenuProvider } from 'react-native-popup-menu';
import RetreatDetailMenu from '../../../components/Menu/RetreatDetailMenu';
import axios from 'axios';

interface Props {
  navigation: any,
  route: any
}
const RetreatDetails: FC<Props> = ({ navigation, route }) => {

  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState(false);

  const [status, setStatus] = useState(false);
  const { retreatid } = route.params;
  const [data, setData] = useState<any>([]);
  // console.log(retreatid, 'uerids');
  useFocusEffect(
    useCallback(() => {
      RetreatList();
    }, []),
  );

  const RetreatList = async () => {
    try {
      setLoading(true);
      // const response: any = await makeApiRequest({
      //   baseUrl: BASE_URL,
      //   method: "POST",
      //   url: TRAINER_RETREAT_DETAILS(retreatid)
      // })

      const response: any = await axios.get(`https://fitwithgrip.com/api/${TRAINER_RETREAT_DETAILS(retreatid)}`);


      console.log("----- response in the retreat details -----", response?.data);

      if (response?.status === 200) {
        setData(response?.data?.data);
        setStatus1(response?.data?.data.apply_status);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("==== Error in the retreat details ===", error);

    }
  };

  const distableFun = async (res: number) => {
    const status = res === 2 ? 'Disable' : 'Enable';
    Alert.alert(
      'Confirmation',
      `Are you sure you want to ${status} ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              const row = {
                status: res,
              };
              setStatus1(res);

              // const response: any = await postMethod(
              //   `user-retreat-status?id=${retreatid}`,
              //   row,
              // );

              const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                data: row,
                method: "POST",
                url: `user-retreat-status?id=${retreatid}`
              })

              console.warn(response.data, 'ds1');
            } catch (error) {
              console.error('Failed to update course status:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  console.log('=== data in the treinaer retreat detsails ===', data);

  const RenderItem = () => (
    <View style={styles.card}>
      <ImageCard img={data.image} rating={data.review?.fullStars} />

      <View style={{ marginBottom: moderateScale(10) }}>
        <CustomText
          text={data?.title}
          weight="700"
          customStyle={{ marginBottom: moderateScale(3) }}
          size={20}
        />
        <CustomText
          text={`${data.trainer || "No Trainer"}`}
          weight="600"
          color={Colors.gray_font}
          size={16}
        />
      </View>

      <TrainerDashboard
        lead={data?.Lead}
        impression={data?.impresssion}
        subs={data?.Suscription}
        click={data?.click}
      />

      <View
        style={[
          globalStyle.flex,
          {
            marginBottom: moderateScale(10),
            backgroundColor: '#f7f7f7',
            paddingVertical: moderateScale(10),
            paddingHorizontal: moderateScale(5),
            borderRadius: moderateScale(8),
            elevation: 3,
            marginHorizontal: moderateScale(5),
          },
        ]}>
        <View
          style={[
            globalStyle.center,
            {
              width: moderateScale(50),
              height: moderateScale(50),
              borderRadius: moderateScale(100),
              backgroundColor: 'rgba(255,0,0,0.1)',
            },
          ]}>
          <CustomIcon
            type="MaterialIcons"
            color="#ff0000"
            // size={22}
            name="location-on"
          />
        </View>

        <View style={{ marginLeft: moderateScale(5) }}>
          <CustomText text="Location" weight="500" color={Colors.gray_font} />
          <CustomText text={data?.location} weight="600" />
        </View>
      </View>

      {data.group_size ? (
        <View
          style={[
            globalStyle.flex,
            {
              marginBottom: moderateScale(10),
              backgroundColor: '#f7f7f7',
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(5),
              borderRadius: moderateScale(8),
              elevation: 3,
              marginHorizontal: moderateScale(5),
            },
          ]}>
          <View
            style={[
              globalStyle.center,
              {
                width: moderateScale(50),
                height: moderateScale(50),
                borderRadius: moderateScale(100),
                backgroundColor: 'rgba(255,0,0,0.1)',
              },
            ]}>
            <CustomIcon
              type="MaterialIcons"
              color="#ff0000"
              // size={22}
              name="group"
            />
          </View>
          <View style={{ marginLeft: moderateScale(5) }}>
            <CustomText text="Member" weight="500" color={Colors.gray_font} />
            <CustomText text={data?.group_size} weight="600" />
          </View>
        </View>
      ) : null}

      <View
        style={[
          globalStyle.flex,
          {
            marginBottom: moderateScale(10),
            backgroundColor: '#f7f7f7',
            paddingVertical: moderateScale(10),
            paddingHorizontal: moderateScale(5),
            borderRadius: moderateScale(8),
            elevation: 3,
            marginHorizontal: moderateScale(5),
          },
        ]}>
        <View
          style={[
            globalStyle.center,
            {
              width: moderateScale(50),
              height: moderateScale(50),
              borderRadius: moderateScale(100),
              backgroundColor: 'rgba(255,0,0,0.1)',
            },
          ]}>
          <CustomIcon
            type="Feather"
            color="#ff0000"
            // size={22}
            name="sun"
          />
        </View>
        <View style={{ marginLeft: moderateScale(5) }}>
          <CustomText text="Days" weight="500" color={Colors.gray_font} />
          <CustomText text={data?.no_of_days} weight="600" />
        </View>
      </View>

      <View
        style={[
          globalStyle.flex,
          {
            marginBottom: moderateScale(10),
            backgroundColor: '#f7f7f7',
            paddingVertical: moderateScale(10),
            paddingHorizontal: moderateScale(5),
            borderRadius: moderateScale(8),
            elevation: 3,
            marginHorizontal: moderateScale(5),
          },
        ]}>
        <View
          style={[
            globalStyle.center,
            {
              width: moderateScale(50),
              height: moderateScale(50),
              borderRadius: moderateScale(100),
              backgroundColor: 'rgba(255,0,0,0.1)',
            },
          ]}>
          <CustomIcon
            type="Feather"
            color="#ff0000"
            // size={22}
            name="moon"
          />
        </View>
        <View style={{ marginLeft: moderateScale(5) }}>
          <CustomText text="Nights" weight="500" color={Colors.gray_font} />
          <CustomText text={data?.no_of_nights} weight="600" />
        </View>
      </View>

      <View
        style={[
          globalStyle.flex,
          {
            marginBottom: moderateScale(10),
            backgroundColor: '#f7f7f7',
            paddingVertical: moderateScale(10),
            paddingHorizontal: moderateScale(5),
            borderRadius: moderateScale(8),
            elevation: 3,
            marginHorizontal: moderateScale(5),
          },
        ]}>
        <View
          style={[
            globalStyle.center,
            {
              width: moderateScale(50),
              height: moderateScale(50),
              borderRadius: moderateScale(100),
              backgroundColor: 'rgba(255,0,0,0.1)',
            },
          ]}>
          <CustomIcon
            type="MaterialIcons"
            color="#ff0000"
            // size={22}
            name="currency-rupee"
          />
        </View>
        <View style={{ marginLeft: moderateScale(5) }}>
          <CustomText text="Price" weight="500" color={Colors.gray_font} />
          <CustomText text={data?.price} weight="600" />
        </View>
      </View>

      {/* <Text style={[styles.text0, {marginLeft: 0}]}>Overview</Text> */}
      <CustomText
        text="Overview"
        size={18}
        weight="700"
        color={Colors.gray_font}
      />
      <Text
        style={[
          styles.text1,
          {
            // width: responsiveWidth(80),
            fontSize: 14,
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data?.overview}
      </Text>

      <CustomText
        text="Accommodation Hotel"
        size={18}
        weight="700"
        customStyle={{ marginTop: moderateScale(10) }}
        color={Colors.gray_font}
      />
      <Text
        style={[
          styles.text1,

          {
            width: screenWidth * .9,
            fontSize: 14,
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data['Accommodation Hotel']}
      </Text>

      <CustomText
        text="Program Detail"
        size={18}
        weight="700"
        customStyle={{ marginTop: moderateScale(10) }}
        color={Colors.gray_font}
      />
      <Text
        style={[
          styles.text1,

          {
            width: screenWidth * .8,
            fontSize: 14,
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data['Program Detail'] != null && data['Program Detail'].length > 250
          ? status
            ? data['Program Detail']
            : data['Program Detail'].substring(0, 250)
          : data['Program Detail']}
      </Text>

      {data['Program Detail'] ? (
        <Pressable
          style={{ flexDirection: 'row' }}
          onPress={() => setStatus(!status)}>
          <Text style={[styles.text1, { color: 'green' }]}>
            {data['Program Detail'] != null &&
              data['Program Detail'].length > 250
              ? status
                ? ' Show More Detail'
                : 'Hide More Detail'
              : ' '}
          </Text>
        </Pressable>
      ) : (
        <View style={{ display: 'none' }}></View>
      )}
    </View>
  );
  return (
    <Container>
      <MenuProvider>
        <View style={{ flex: .07 }} >
          <RetreatDetailMenu retreatMenu={data} isEnable={data?.status} handleEnable={(isEnable: any) => distableFun(isEnable)} />
        </View>
        <ScrollView
          style={{ flex: .9 }}
          showsVerticalScrollIndicator={false}
        >
          <RenderItem />
        </ScrollView>
      </MenuProvider>
    </Container>
  )
}

export default RetreatDetails

const styles = StyleSheet.create({
  card: {
    // padding: moderateScale(8),
    paddingBottom: 0,
    marginBottom: moderateScale(10),
    borderLeftWidth: 0.1,
    alignSelf: 'center',
  },
  text1: {
    width: screenWidth * .9,
    flexWrap: 'wrap',
    textAlign: 'left',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginBottom: 0,
    letterSpacing: 1,
    color: 'black',
  },
})