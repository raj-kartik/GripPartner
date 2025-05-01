import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomModal from '../Customs/CustomModal'
import { moderateScale, screenHeight, screenWidth } from '../Matrix/Matrix'
import { globalStyle } from '../../utils/GlobalStyle'
import CustomText from '../Customs/CustomText'
import CustomIcon from '../Customs/CustomIcon'
import { useFocusEffect } from '@react-navigation/native'
import makeApiRequest from '../../utils/ApiService'
import { DEFAULT_URL, GET_COOUNTY_REGION_CODE } from '../../utils/api'

const StateModal = ({ showmodal, setShowModal, handleState }: any) => {

    const [country, setCountry] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        const countryFunction = async () => {
            setLoading(true);
            try {
                const response: any = await makeApiRequest({
                    baseUrl: DEFAULT_URL,
                    method: 'GET',
                    url: GET_COOUNTY_REGION_CODE,
                });

                if (!response.error) {
                    setCountry(response.data?.available_regions);
                }
            } catch (error) {
                console.log(error, 'err');
            } finally {
                setLoading(false);
            }
        };
        countryFunction();
    }, []));

    return (
        <CustomModal
            iscenter={false}
            onDismiss={() => {
                setShowModal(false);
            }}
            visible={showmodal}
            containerStyle={{
                width: screenWidth,
                backgroundColor: '#f7f7f7',
                paddingVertical: moderateScale(15),
                paddingHorizontal: moderateScale(10),
            }}>
            <View
                style={[
                    globalStyle.betweenCenter,
                    { marginBottom: moderateScale(10) },
                ]}>
                <CustomText text="Select the State" weight="700" size={18} />
                <Pressable
                    onPress={() => {
                        // handleState()
                        setShowModal(false);
                    }}>
                    <CustomIcon type="Entypo" name="circle-with-cross" />
                </Pressable>
            </View>
            <View
                style={{
                    bottom: 0,
                    backgroundColor: '#f7f7f7',
                    paddingVertical: moderateScale(10),
                    height: screenHeight * 0.5,
                }}>
                <FlatList
                    data={country}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                style={{
                                    marginBottom: moderateScale(10),
                                    marginHorizontal: moderateScale(10),
                                    backgroundColor: '#fff',
                                    paddingVertical: moderateScale(15),
                                    paddingHorizontal: moderateScale(5),
                                    borderRadius: moderateScale(10),
                                }}
                                onPress={() => {
                                    // setFieldValue(`${prefix}state`, item);
                                    handleState(item?.name)
                                    setShowModal(false);
                                }}>
                                <CustomText text={item?.name} />
                            </Pressable>
                        )
                    }}
                />
            </View>
        </CustomModal>
    )
}

export default StateModal

const styles = StyleSheet.create({})