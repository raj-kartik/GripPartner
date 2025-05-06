import { FlatList, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomModal from '../Customs/CustomModal'
import CustomText from '../Customs/CustomText'
import { moderateScale, screenHeight } from '../Matrix/Matrix'
import CustomInput from '../Customs/CustomInput'
import { POST_WITHDRAW_REQUEST } from '../../utils/api'
import CustomToast  from '../Customs/CustomToast'
import makeApiRequest from '../../utils/ApiService'
import CustomButton from '../Customs/CustomButton'
import Colors from '../../utils/Colors'

// import CustomModal from '../../Custom/CustomModal'
// import CustomText from '../../Custom/CustomText'
// import { moderateScale, screenHeight } from '../../Matrix/Matrix'
// import colors from '../../../style/colors'
// import CustomInput from '../../Custom/CustomInput'
// import CustomButton from '../../Custom/CustomButton'
// import makeApiRequest from '../../../../utils/API/apiServices'
// import { POST_WITHDRAW_REQUEST } from '../../../../utils/API/api'
// import CustomToast  from '../../Custom/CustomToast'

const AddAmountCard = ({ visiable, onDismiss, isAddAmount = true, title = "Add Amount", handlePayment }: any) => {
    const [number, setNumber] = useState('')
    const { bank } = useSelector((state: any) => state?.bank);
    const { user } = useSelector((state: any) => state?.user);
    const [isSelectAccount, setIsSelectAccount] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<any>({})

    useEffect(() => {
        // Load selected bank from AsyncStorage when modal opens
        const getSelectedBank = async () => {
            try {
                const storedBank = await AsyncStorage.getItem('selectedBank');
                console.log("==== storedBank in the bank =====", storedBank);
                if (storedBank) {
                    setSelectedAccount(JSON.parse(storedBank));
                }
            } catch (error) {
                console.log('Error fetching selected bank:', error);
            }
        };

        getSelectedBank();
    }, []);

    console.log("==== selectedAccount in the bank =====", selectedAccount);
    const handleBank = async (bank: any) => {
        setSelectedAccount(bank);
        await AsyncStorage.setItem('selectedBank', JSON.stringify(bank));
    };

    const handleWithdraw = async () => {
        try {
            const response: any = await makeApiRequest({
                method: "POST",
                url: POST_WITHDRAW_REQUEST,
                data: {
                    user_id: user?.id,
                    amount: number,
                    user_account: selectedAccount?.id || 1
                }
            })

            // console.log("==== response in the withdraw request ====", response);

            if (response?.status === 'success') {
                onDismiss();
                setNumber('');
                CustomToast({
                    type: "success",
                    text1: "Withdraw request sent successfully",
                    text2: "Withdrawal Request Successful",
                })
            }
            else {
                CustomToast({
                    type: "error",
                    text1: "Withdraw request failed",
                    text2: response?.message || "Withdrawal Request Failed",
                })
            }

        }
        catch (error) {
            console.log("Error at handleWithdraw", error);
        }
    }

    const maskAccountNumber = (accountNumber: string) => {
        if (!accountNumber) return "";
        const lastFour = accountNumber.slice(-4); // Get last 4 digits
        return `XXXXXX${lastFour}`; // Always show 6 Xs + last 4 digits
    };


    return (
        <CustomModal iscenter={false} visible={visiable} onDismiss={onDismiss} containerStyle={{ width: "100%", height: "33%", paddingBottom: moderateScale(10) }} >
            <View style={{ width: moderateScale(100), height: moderateScale(3.5), borderRadius: moderateScale(10), backgroundColor: Colors.gray_font, alignSelf: "center", marginVertical: moderateScale(5) }} />
            <CustomText text={title} size={18} weight='600' customStyle={{ textAlign: "center", marginTop: moderateScale(5) }} />

            {
                !isAddAmount &&
                <TouchableOpacity onPress={() => { setIsSelectAccount(true) }} style={{ marginTop: moderateScale(10) }} >
                    <CustomText text='Select Your Bank' weight='600' size={14} customStyle={{ color: Colors.gray_font, marginBottom: moderateScale(5) }} />
                    <CustomText text={`${selectedAccount?.bank_name ? selectedAccount?.bank_name.toUpperCase() : "Add Bank"} (${maskAccountNumber(selectedAccount?.account_number)})`} weight='700' size={16} customStyle={{ color: Colors.gray_font }} />
                </TouchableOpacity>
            }
            <KeyboardAvoidingView style={{ marginBottom: moderateScale(20) }} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    <CustomInput keyboardType='numeric' customStyle={{ width: "98%", alignSelf: "center" }} text='Enter Amount' handleChangeText={(text: string) => setNumber(text)} value={number.toString()} />
                    <CustomButton title={isAddAmount ? 'Add In Wallet' : 'Withdraw'} onPress={() => {
                        if (isAddAmount) {
                            handlePayment(number);
                        } else {
                            handleWithdraw();
                        }

                    }} customStyle={{ marginVertical: moderateScale(20) }} />
                </ScrollView>
            </KeyboardAvoidingView>


            <CustomModal iscenter={false} visible={isSelectAccount} containerStyle={{ height: screenHeight * .5, width: "100%" }} onDismiss={() => { setIsSelectAccount(false) }} >
                <View style={{ width: moderateScale(50), height: moderateScale(3.5), borderRadius: moderateScale(10), backgroundColor: Colors.gray_font, alignSelf: "center", marginVertical: moderateScale(5) }} />
                <CustomText text='Select Bank' customStyle={{ textAlign: "center", marginTop: moderateScale(5) }} weight='600' size={15} />
                <FlatList
                    data={bank}
                    keyExtractor={(item: any) => item?.id}
                    renderItem={({ item }: any) => {
                        const isSelected = selectedAccount?.id === item?.id;

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.atmContainer,
                                    isSelected && { borderWidth: 2, borderColor: Colors.activeRadio, padding: 5 }
                                ]}
                                onPress={() => handleBank(item)}
                            >
                                <View style={{ paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(5), borderRadius: moderateScale(2), position: "absolute", top: moderateScale(10), right: moderateScale(10), backgroundColor: item?.is_verified === 1 ? Colors.activeRadio : Colors.red }} >
                                    <CustomText text={item?.is_verified === 1 ? "verified" : "not verify"} weight='500' color='#fff' />
                                </View>
                                <CustomText text={item?.bank_name} size={24} weight='700' color={Colors.gray_font} />
                                <CustomText text={item?.account_number} size={18} weight='600' customStyle={{ marginTop: moderateScale(3) }} />
                                <CustomText text={item?.ifsc_code} weight='600' size={16} customStyle={{ marginTop: moderateScale(3) }} />
                            </TouchableOpacity>
                        );
                    }}
                />
            </CustomModal>
        </CustomModal>
    )
}

export default AddAmountCard

const styles = StyleSheet.create({
    atmContainer: {
        height: screenHeight * .2,
        borderWidth: 1,
        borderRadius: moderateScale(8),
        marginTop: moderateScale(5),
        marginBottom: moderateScale(10),
        padding: moderateScale(10),
    }
})