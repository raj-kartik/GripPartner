import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_LOCATION_KEY } from '../../../utils/api';
const LocationTracker = () => {
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data: any, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_LOCATION_KEY,
          language: 'en',
        }}
      />
    </View>
  )
}

export default LocationTracker

const styles = StyleSheet.create({})