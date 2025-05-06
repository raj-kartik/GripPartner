import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '../../../components/Container'
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2'
import { useFocusEffect } from '@react-navigation/native'
import CustomInput from '../../../components/Customs/CustomInput'
import { fetchLocationUtility } from '../../../utils/UtilityFuncations'
import { moderateScale } from '../../../components/Matrix/Matrix'


const locationApi = "AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0";

const LocationTracker = () => {

  const [place, setPlace] = useState('');
  const [location, setLocation] = useState<any>(null);
  useFocusEffect(useCallback(() => {
    const placeLocation = async () => {
      try {
        const response = await fetchLocationUtility(place);
        setLocation(response);

      } catch (error) {
        console.error("Error fetching location data: ", error);
      }
    }
    placeLocation();
  }, [place]));


  return (
    <Container>
      <CustomHeader2 title="Location Tracker" />
      <CustomInput text='Location' handleChangeText={(text: string) => {
        setPlace(text)
      }} />
      {
        location?.length > 0 && <FlatList
          data={location}
          keyExtractor={(item: any) => item?.place_id}
          renderItem={({ item }: any) => {
            return (
              <View style={[styles.content]}>
                <Text>{item?.description}</Text>
              </View>
            )
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: moderateScale(100) }}
        />
      }

    </Container>
  )
}

export default LocationTracker

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(5),
  },
})