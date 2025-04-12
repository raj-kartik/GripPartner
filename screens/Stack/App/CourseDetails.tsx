import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Suspense, useCallback, useState } from 'react'
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Container from '../../../components/Container';
import { globalStyle } from '../../../utils/GlobalStyle';
import { moderateScale, screenHeight } from '../../../components/Matrix/Matrix';
import CustomIcon from '../../../components/Customs/CustomIcon';
import CustomText from '../../../components/Customs/CustomText';
import CustomButton from '../../../components/Customs/CustomButton';
import CustomModal from '../../../components/Customs/CustomModal';
import { BASE_URL } from '../../../utils/api';
import makeApiRequest from '../../../utils/ApiService';
import Colors from '../../../utils/Colors';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import TrainingDetail from '../../../components/CourseComponent/TrainingDetails';

interface Slot {
  availability: number;
  batch_strength: number;
  course_id: number;
  created_at: string;
  end_time: string;
  id: number;
  slot_days: string;
  slot_type: string;
  start_time: string;
  updated_at: string;
  user_id: number;
}
const CourseDetails = ({ route }: any) => {

  const [isMoreDescription, setIsMoreDescription] = useState(false);
  const { courseid } = route.params;
  const { user } = useSelector((state: any) => state.user);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [slotModal, setSlotModal] = useState(false);
  const [selectSlot, setSelectSlot] = useState<Slot>(null);
  const navigation = useNavigation();
  const id = user?.id;

  // console.log("=== user ===",user);
  

  useFocusEffect(
    useCallback(() => {
      CourseList();
      courseImpression(courseid);
    }, [id]),
  );

  const CourseList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(BASE_URL + `course-detail/?id=${courseid}`);

      if (response.status ===200) {
        setData(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const courseImpression = async (courseid: number) => {
    setLoading(true);
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [
          {
            course: [courseid], // Send the entire array of IDs
          },
        ],
      };
      // const response: any = await postMethod('tracking-site', row);
      const response: any = await makeApiRequest({
        url: 'tracking-site',
        baseUrl: BASE_URL,
        data: { row },
        method: 'POST',
      });
      if (response.status === 200) {
        // console.warn(response.data, row.dataArray, 'j');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading state is reset on error
    }
  };



  const handleJoin = async () => { };

  const RenderItem = () => (
    <View style={styles.card}>
      <View style={styles.image}>
        <Image style={styles.image} source={{ uri: data?.select_image }} />
        <View
          style={[
            globalStyle.flex,
            {
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: '#fff',
              borderRadius: moderateScale(5),
              paddingHorizontal: moderateScale(5),
              bottom: moderateScale(5),
              right: moderateScale(10),
              elevation: 3,
            },
          ]}>
          <CustomIcon type="AntDesign" name="star" color={Colors.orange} />
          <View
            style={{
              marginLeft: moderateScale(5),
              marginBottom: moderateScale(3),
            }}>
            <CustomText
              text={parseFloat(data?.fullstar).toFixed(1)}
              weight="700"
              customStyle={{ marginTop: moderateScale(3) }}
            />
            <CustomText
              text={`(${parseFloat(data?.totalreview).toFixed(0)})`}
              weight="700"
              size={12}
              color={Colors.gray_font}
              customStyle={{
                alignSelf: 'center',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            />
          </View>
        </View>
      </View>

      <View>
        <CustomText text={data?.name} size={22} weight="700" />
        <CustomText
          text={data?.trainer}
          size={16}
          weight="500"
          color={Colors.gray_font}
        />
      </View>

      <View style={[globalStyle.flex, { marginTop: moderateScale(10) }]}>
        <CustomIcon type="Ionicons" name="location-sharp" />
        <Text style={styles.text1}>{data.location}</Text>
      </View>

      {data.price ? (
        <View style={[globalStyle.row]}>
          <CustomIcon type="MaterialIcons" name="currency-rupee" />
          <CustomText text={data?.price} weight="500" />
        </View>
      ) : null}

      <View style={styles.descriptionContainer}>
        <CustomText text="Description" weight="500" size={15} />
        <View style={[globalStyle.row]}>
          <CustomText
            text={
              typeof data?.description === 'string' &&
                data?.description.length > 50
                ? `${data.description.slice(0, 50)}...`
                : data?.description || ''
            }
            weight="400"
            customStyle={{ marginTop: moderateScale(2) }}
            size={14}
          />
          {typeof data?.description === 'string' &&
            data.description.length > 50 && (
              <Pressable
                onPress={() => setIsMoreDescription(!isMoreDescription)}>
                <CustomText
                  weight="500"
                  customStyle={{ marginLeft: 3 }}
                  text={isMoreDescription ? 'Show less' : 'Show more'}
                />
              </Pressable>
            )}
        </View>
      </View>
    </View>
  );

  return (
    <Container>
      <CustomHeader2 title="Course Details" />
      <ScrollView
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
        showsHorizontalScrollIndicator={false}>
        {/* <Text style={styles.text0}>Courses</Text> */}
        {loading ? (
          <ActivityIndicator size={20} color={'black'} />
        ) : (
          <RenderItem />
        )}
        <TrainingDetail
          item={data}
          courseid={courseid}
          Coursedata={false}
        />
        {loading ? (
          <ActivityIndicator size={20} color={'black'} />
        ) : (
          <Suspense
            fallback={<ActivityIndicator size={20} color={'black'} />}>
            {/* <Review navigation={navigation} courseid={courseid} /> */}
          </Suspense>
        )}
      </ScrollView>

      <View>
        {id !== data.user_id && (
          <View
            style={{
              backgroundColor:
                id === data.user_id ? 'rgba(255,255,255,.5)' : '',
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 10,
            }}
          />
        )}
        <CustomButton
          title="Join Now"
          disabled={id !== data.user_id}
          customStyle={{ marginBottom: moderateScale(5) }}
          onPress={() => {
            setSlotModal(true);
          }}
        />
        <CustomButton
          title="Write a Review"
          bg={Colors.orange}
          customStyle={{ marginBottom: moderateScale(10) }}
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ReviewDetailPage',
                params: {
                  courseid: courseid,
                  course: data,
                },
              }),
            )
          }
        />
      </View>

      <CustomModal
        iscenter={false}
        visible={slotModal}
        containerStyle={{ width: '100%', height: screenHeight * 0.5 }}
        onDismiss={() => {
          setSlotModal(false);
        }}>
        <View
          style={{
            width: '25%',
            alignSelf: 'center',
            height: moderateScale(3),
            borderRadius: moderateScale(20),
            backgroundColor: Colors.gray_font,
            marginBottom: moderateScale(5),
            marginTop: moderateScale(3),
          }}
        />
        <CustomText
          text="Select Slot"
          customStyle={{ textAlign: 'center' }}
          size={18}
          weight="600"
        />
        <View style={{ flex: 0.85, marginTop: moderateScale(5) }}>
          <FlatList
            numColumns={3}
            showsVerticalScrollIndicator={false}
            data={data?.slottime?.slots}
            keyExtractor={item => item?.id}
            renderItem={({ item }: any) => {
              // console.log("==== item ====", item);
              const isSelect = selectSlot?.id === item.id;
              return (
                <Pressable
                  onPress={() => {
                    setSelectSlot(item);
                  }}
                  style={[
                    styles.slot,
                    {
                      backgroundColor:
                        item?.availability === 0
                          ? 'rgba(255,0,0,0.1)'
                          : isSelect
                            ? 'rgba(81, 168, 21,0.1)'
                            : '#fff',
                      borderColor:
                        item?.availability === 0
                          ? 'rgb(255,0,0)'
                          : isSelect
                            ? '#347507'
                            : 'rgb(0,0,0)',
                    },
                  ]}
                  disabled={
                    item?.availability <= item?.batch_strength ? false : true
                  }>
                  <CustomText
                    weight="500"
                    text={`${item?.start_time} - ${item?.end_time}`}
                    color={
                      item?.availability === 0
                        ? 'rgb(255,0,0)'
                        : isSelect
                          ? '#347507'
                          : 'rgb(0,0,0)'
                    }
                  />
                  {item?.availability === 0 && (
                    <CustomText
                      size={12}
                      weight="500"
                      color={Colors.red}
                      text="Currently Unavailable"
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
        <View style={{ flex: 0.15 }}>
          <CustomButton onPress={handleJoin} title="Join Now" />
        </View>
      </CustomModal>
    </Container>
  )
}

export default CourseDetails

const styles = StyleSheet.create({
  descriptionContainer: {
    backgroundColor: '#f7f7f7',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    elevation: 5,
    marginTop: moderateScale(10),
  },
  text1: {
    width: "80%",
    flexWrap: 'wrap',
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 0,
    letterSpacing: 1,
    color: 'black',
  },
  image: {
    height: screenHeight * 0.3,
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: moderateScale(5),
    paddingBottom: 0,
    marginBottom: moderateScale(15),
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
    marginTop: 10,
    alignSelf: 'center',
  },
  slot: {
    borderWidth: 1.5,
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    alignItems: 'center',
  },
})