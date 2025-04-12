import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale } from '../Matrix/Matrix'
// import { globalStyle } from '../../../utils/GlobalStyles'
// import { callPhoneNumber } from '../../../utils/utilityFunction'
// import CustomIcon from '../Custom/CustomIcon'
import { useNavigation } from '@react-navigation/native'
import { globalStyle } from '../../utils/GlobalStyle'
import CustomIcon from '../Customs/CustomIcon'
import { callPhoneNumber } from '../../utils/UtilityFuncations'


const ChatPhoneCard = (lead: any) => {

    const navigation = useNavigation();
    return (
        <View style={[globalStyle.flex]}>
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => { callPhoneNumber(lead?.phone || lead?.phone_no) }}
                style={[
                    { marginRight: moderateScale(5) },
                ]}>
                <CustomIcon type="AntDesign" name="phone" />
            </TouchableOpacity>

            {/* <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ChatScreen', {
                        course_id: data?.id,
                        item: {
                            user_id: lead?.user_id,
                            profile_image: lead?.image
                        },
                    })
                }}
                style={[
                    {
                        marginTop: moderateScale(5),
                        marginHorizontal: moderateScale(10),
                    },
                ]}>
                <CustomIcon type="Ionicons" name="chatbox-ellipses-outline" />
            </TouchableOpacity> */}
        </View>
    )
}

export default ChatPhoneCard

const styles = StyleSheet.create({})