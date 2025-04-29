// import { useEffect } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
// import { globalStyle } from '../../../utils/GlobalStyle';
// import CustomButton from '../../../components/Customs/CustomButton';
// import CustomIcon from '../../../components/Customs/CustomIcon';
// import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
// import { fetchLocation, startTracking, stopTracking } from '../../../redux/Slice/LiveSlice';
// import Container from '../../../components/Container';
// import CustomText from '../../../components/Customs/CustomText';

// const LocationTracker = () => {
//     const dispatch = useDispatch();
//     const { fullAddress, shortAddress, isTracking, location } = useSelector(
//         (state: any) => state.location,
//     );


//     const navigation = useNavigation();

//     useEffect(() => {
//         if (isTracking) {
//             dispatch(fetchLocation({}));
//         }

//         const storeLocation = async () => {
//             await AsyncStorage.setItem(
//                 'location',
//                 JSON.stringify({ location, fullAddress }),
//             );
//         };

//         storeLocation();
//     }, [isTracking, dispatch]);

//     const handleStartTracking = () => {
//         dispatch(startTracking());
//         navigation.goBack();
//     };

//     const handleStopTracking = () => {
//         dispatch(stopTracking());
//     };

//     return (
//         <Container>
//             <CustomHeader2 title="Select your location" />
//             <View style={styles.mapContainer}>
//                 <MapView
//                     provider={PROVIDER_GOOGLE}
//                     style={styles.map}
//                     region={{
//                         latitude: location?.latitude || 37.78825,
//                         longitude: location?.longitude || -122.4324,
//                         latitudeDelta: 0.0015,
//                         longitudeDelta: 0.0001,
//                     }}>
//                     {/* Add Marker with Custom Icon */}
//                     <Marker
//                         coordinate={{
//                             latitude: location?.latitude || 37.78825,
//                             longitude: location?.longitude || -122.4324,
//                         }}
//                         draggable
//                         onDragEnd={e => {
//                             const newCoordinate = e.nativeEvent.coordinate;
//                             console.log('New Marker Position:', newCoordinate);
//                             dispatch(fetchLocation({ latitude: newCoordinate.latitude, longitude: newCoordinate.longitude }));
//                             // dispatch(setStoredLocation(newCoordinate));
//                             // Update state or perform other actions with new coordinate
//                         }}>
//                         <CustomIcon
//                             type="MaterialIcons"
//                             name="person-pin"
//                             color="#000"
//                             size={40}
//                         />
//                     </Marker>
//                 </MapView>
//                 <View style={styles.detectContainer}>
//                     <TouchableOpacity
//                         onPress={handleStartTracking}
//                         activeOpacity={0.8}
//                         style={[
//                             globalStyle.row,
//                             {
//                                 backgroundColor: '#000',
//                                 padding: moderateScale(5),
//                                 paddingHorizontal: moderateScale(10),
//                                 borderRadius: moderateScale(5),
//                             },
//                         ]}>
//                         <CustomIcon type="MaterialIcons" name="my-location" color="#fff" />
//                         <CustomText
//                             text="Use Current Location"
//                             color="#fff"
//                             customStyle={{ marginLeft: moderateScale(5) }}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//             <View style={styles.content}>
//                 <View style={[globalStyle.flex]}>
//                     {/* location */}
//                     <View style={{ flex: 0.8 }}>
//                         <View style={[globalStyle.row]}>
//                             <CustomIcon
//                                 name="map-marker-alt"
//                                 size={18}
//                                 type="Fontisto"
//                                 color="#fff"
//                                 customStyle={{ padding: 0, margin: 0, alignSelf: 'center' }}
//                             />
//                             <CustomText
//                                 text={shortAddress || 'No Location'}
//                                 weight="700"
//                                 customStyle={{ marginLeft: moderateScale(5) }}
//                                 size={18}
//                                 color="#fff"
//                             />
//                         </View>
//                         <CustomText
//                             text={fullAddress || 'No Location'}
//                             color="#fff"
//                             size={12}
//                             customStyle={{ marginTop: moderateScale(10) }}
//                         />
//                     </View>

//                     {/* change */}
//                 </View>
//                 <CustomButton
//                     onPress={handleStopTracking}
//                     customStyle={{ marginVertical: moderateScale(10) }}
//                     textColor="#000"
//                     bg="#fff"
//                     title="CONFIRM LOCATION"
//                 />
//             </View>
//         </Container>
//     );
// };

// export default LocationTracker;

// const styles = StyleSheet.create({
//     map: {
//         width: '100%',
//         alignSelf: 'center',
//         flex: 1,
//     },
//     mapContainer: {
//         width: screenWidth,
//         alignSelf: 'center',
//         flex: 0.8,
//     },
//     detectContainer: {
//         // backgroundColor:"#f7f7f7",
//         position: 'absolute',
//         bottom: moderateScale(20),
//         left: 0,
//         right: 0,
//         // width:"50%",
//         padding: moderateScale(5),
//         borderRadius: moderateScale(5),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     content: {
//         flex: 0.2,
//         backgroundColor: '#000',
//         width: screenWidth,
//         alignSelf: 'center',
//         padding: moderateScale(10),
//     },
// });
