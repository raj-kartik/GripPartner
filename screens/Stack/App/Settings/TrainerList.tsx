import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import Container from '@components/Container'
import CustomHeader2 from '@components/Customs/Header/CustomHeader2'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import makeApiRequest from '@utils/ApiService'
import { BASE_URL, POST_TRAINER_LIST } from '@utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { trainerList } from '@redux/Slice/TrainerSlice'
import CustomText from '@components/Customs/CustomText'
import { moderateScale } from '@components/Matrix/Matrix'
import Colors from '@utils/Colors'
import TrainerCard from '@components/Cards/Studio/TrainerCard'
import Images from '@utils/Images'

const TrainerList = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: any) => state?.user);
  const { data } = useSelector((state: any) => state?.trainer);
  const dispatch: any = useDispatch();
  useFocusEffect(useCallback(() => {

    fetchTrainer()
  }, []))

  const fetchTrainer = async () => {
    await dispatch(trainerList(user?.id))
  }


  console.log("Trainer List Data: ", data);

  return (
    <Container>
      <CustomHeader2 title="Trainer" isMore={true} iconType="AntDesign" iconName="plus" handleMore={() => {
        navigation.navigate('AddTrainer')
      }} />
      {
        data && data.length > 0 ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: moderateScale(10) }}
            renderItem={({ item }) => <TrainerCard item={item} onDelete={() => {
              fetchTrainer()
            }} />}
            keyExtractor={item => item.first_name}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
            <CustomText text='No trainers found.' weight='500' size={18} />
          </View>
        )
      }
    </Container>
  )
}

export default TrainerList

const styles = StyleSheet.create({
  trainerContainer: {
    width: "98%",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
    backgroundColor: "#f7f7f7",
    elevation: 2,
    height: moderateScale(100),
    alignSelf: "center",
    borderRadius: moderateScale(5),
  }
})