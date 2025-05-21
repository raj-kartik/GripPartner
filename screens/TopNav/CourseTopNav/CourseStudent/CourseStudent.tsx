import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import Container from '../../../../components/Container';
import CustomText from '../../../../components/Customs/CustomText';
import commonStyle from '../../../../utils/CommonStyleComponent';
import { moderateScale, screenHeight } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import Images from '../../../../utils/Images';
import { globalStyle } from '../../../../utils/GlobalStyle';
import SubsSkeleton from '@components/Skeleton/SubsSkeleton';

const CourseStudent = () => {

  // const trainerId = useSelector((state: any) => state.List.id);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [message, setMessage] = useState([]);
  const { user } = useSelector((state: any) => state.user);


  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  const leadLisfun = async () => {
    setLoading(true);
    const row = {
      userId: user?.id,
    };
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: "POST",
        data: row,
        url: 'course-subscription-student'
      })


      // console.log("==== response in the student course ====", response);

      if (response?.status === 'success') {
        setStudent(response.followUp);
        setMessage(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };


  return (
    <Container>

      {
        loading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            style={{ paddingHorizontal: moderateScale(5), paddingTop: moderateScale(5) }}
            contentContainerStyle={{ rowGap: moderateScale(10) }}
            keyExtractor={(item: any) => item}
            renderItem={() => (
              <SubsSkeleton />
            )}
          />
        ) : (
          <ScrollView
            style={{ flexGrow: 1, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}>
            {student.length > 0 ? (
              student.map((item: any, index) => {
                console.log('--- item in the students dashboard ---', item);

                return (
                  <View style={styles.row} key={item.id}>
                    <View style={styles.row1}>
                      {
                        item?.image ? (
                          <Image
                            style={{ width: moderateScale(70), height: moderateScale(70), borderRadius: moderateScale(100) }}
                            source={{ uri: item?.image }} />
                        ) : (
                          <View style={[globalStyle.center, { width: moderateScale(70), height: moderateScale(70), borderRadius: moderateScale(200), backgroundColor: "#f7f7f7" }]} >
                            <Images.Logo width={moderateScale(60)} height={moderateScale(60)} />
                          </View>
                        )
                      }
                      <View>
                        <CustomText
                          size={20}
                          weight="700"
                          // family="Roboto-Bold"
                          text={item?.name || 'No Name'}
                        />
                        <CustomText
                          // size={12}
                          text={item?.course_name}
                          weight="500"
                          color={Colors.gray_font}
                        />
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={commonStyle.modalView}>
                <Text style={commonStyle.modalText}>Oops! No Subscription found</Text>
              </View>
            )}
          </ScrollView>
        )
      }


    </Container>
  )
}

export default CourseStudent

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: moderateScale(20),
    width: '99%',
    height: screenHeight * .12,
    padding: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(15),
    borderWidth: 0.5,
    borderColor: Colors.lightGray,
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
  },
})