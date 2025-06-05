import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '@components/Container'
import CustomText from '@components/Customs/CustomText'
import CustomButton from '@components/Customs/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { moderateScale } from '@components/Matrix/Matrix'
import Colors from '@utils/Colors'
import { useDispatch } from 'react-redux'
import { userDetail } from '@redux/Slice/UserSlice/UserSlice'

const IsAddStudio = () => {
    const dispatch: any = useDispatch();
    const navigation = useNavigation();
    return (
        <Container >
            <View
                style={{ marginTop: moderateScale((30)) }}
            />

            <Pressable onPress={async () => {
                await dispatch(userDetail())
                navigation.navigate('BottomTabs')
            }} style={{ position: "absolute", top: moderateScale(10), right: moderateScale(30), zIndex: 10 }} >
                <CustomText text='Skip' color={Colors.gray_font} />
            </Pressable>

            <CustomText text='Do You want to add your Studio?' weight='600' size={24} />
            <CustomText customStyle={{ marginVertical: moderateScale(5) }} text='Add you Studio to create course and retreat' color={Colors.gray_font} weight='500' />

            <View style={{ marginTop: moderateScale(10) }} >
                <CustomButton
                    title='Add Studio'
                    bg={Colors.orange}

                    onPress={() => {
                        navigation.navigate('UpdateStudioProfile')
                    }}
                />
            </View>
        </Container>
    )
}

export default IsAddStudio

const styles = StyleSheet.create({})