import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../../../components/Container';
import { moderateScale, screenHeight } from '../../../../components/Matrix/Matrix';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import { globalStyle } from '../../../../utils/GlobalStyle';
import { getWalletBalance } from '../../../../redux/Slice/WalletSlice';
import CustomText from '../../../../components/Customs/CustomText';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomModal from '../../../../components/Customs/CustomModal';
import CustomInput from '../../../../components/Customs/CustomInput';
import makeApiRequest from '../../../../utils/ApiService';
import { POST_ADD_BANK, POST_ADD_WALLET } from '../../../../utils/api';
import { CustomToast } from '../../../../components/Customs/CustomToast';
import WalletCard from '../../../../components/Cards/WalletCard';
import AddAmountCard from '../../../../components/Cards/AddAmountCard';
import { fetchTrainerBank } from '../../../../redux/Slice/BankSlice';
import useRazorpayPayment from '../../../../components/Hooks/useRazorpayPayment';
import Colors from '../../../../utils/Colors';
import WalletTransaction from '../../../../components/WalletComponent/WalletTransaction';
// import WalletTransaction from '../../Component/Cards/Wallet/WalletTransaction';


const addAccountSchema = yup.object().shape({
    accountHolder: yup
        .string()
        .required('*required')
        .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
        .min(3, 'Too short')
        .max(25, 'Too long'),

    bankName: yup
        .string()
        .required('*required')
        .min(3, 'Too short')
        .max(25, 'Too long'),

    accountNumber: yup
        .string()
        .required('*required')
        .matches(/^[0-9]{11,19}$/, 'Invalid account number'),

    confirmAccountNumber: yup
        .string()
        .required('*required')
        .oneOf([yup.ref('accountNumber')], 'Account numbers must match'),

    ifscCode: yup
        .string()
        .required('*required')
        .matches(/^[A-Za-z0-9]{11}$/, 'Invalid IFSC code'),
});

const Payments = () => {
    const dispatch = useDispatch();
    const { user }: any = useSelector((state: any) => state.user);
    //   const { data } = useSelector((state: any) => state?.wallet);
    //   const { bank } = useSelector((state: any) => state?.bank);
    const [IsAccountModal, setIsAccountModal] = useState(false);
    const [amountModal, setAmountModal] = useState(false);
    const [withdrawModal, setWithdrawModalModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isKyc = user?.kyc || user?.kyc;
    useEffect(() => {
        const fetData = async () => {
            await dispatch(getWalletBalance(user?.id));
            await dispatch(fetchTrainerBank(user?.id));
            // await dispatch(userDetail());
        };

        fetData();
    }, []);

    const handleSaveAccount = async (value: any) => {
        setLoading(true);
        try {
            const response: any = await makeApiRequest({
                url: POST_ADD_BANK,
                data: {
                    user_id: user?.id,
                    account_number: value?.accountNumber,
                    ifsc_code: value?.ifscCode,
                    bank_name: value?.bankName,
                    account_holder: value?.accountHolder
                },
                method: 'POST',
            })

            console.log("==== response ===", response);
            if (response?.status === 'success') {
                CustomToast({
                    type: "success",
                    text1: "Account added successfully",
                    text2: "Your bank account has been added successfully.",
                })
                setIsAccountModal(false);
            }
            else {
                CustomToast({
                    type: "error",
                    text1: "Failed to add account",
                    text2: response?.errors?.account_number[0] || "Unable to add your bank account.",
                })
            }

        }
        catch (error) {
            console.error(error);
            CustomToast({
                type: "error",
                text1: "Something went wrong",
                text2: "Unable to add your bank account.",
            })
        }
        finally {
            setLoading(false);
        }
    }


    const { processPayment, PayLoading } = useRazorpayPayment();
    const handleAddAmount = (amount: number) => {
        const profile = {
            email: user?.email || "",
            phone_number: user?.phone_number || "",
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
        };
        processPayment(amount, profile,
            (successData: any) => {
                const fetchPayment = async () => {
                    try {
                        const response: any = await makeApiRequest({
                            url: POST_ADD_WALLET,
                            data: {
                                user_id: user?.id,
                                amount: successData?.amount,
                                transaction_id: successData?.razorpay_payment_id,
                                payment_status: successData?.status,
                            },
                            method: 'POST',
                        })

                        if (response.status === 'success') {
                            await dispatch(getWalletBalance(user?.id))
                            CustomToast({
                                type: "success",
                                text1: "Payment successful",
                                text2: "Your payment has been completed successfully.",
                            })
                        }
                    }
                    catch (err) {
                        CustomToast({
                            type: "error",
                            text1: "Payment failed",
                            text2: "Unable to complete your payment.",
                        })
                    }
                }

                fetchPayment();
                console.log('Payment Success:', successData);
            },
            (error: any) => {
                console.log('Payment Failed:', error);
            }
        );
    }

    if (PayLoading)
        return <ActivityIndicator color="#000" size="large" style={{ flex: 1 }} />

    return (
        <Container customStyle={{ paddingTop: moderateScale(10) }}>

            <CustomHeader2 title="Wallet" />
            {/* <View style={{ flexDirection: "row", width: "100%", alignSelf: "center" }} >
                <TouchableOpacity style={{ marginRight: moderateScale(10) }} >
                    <CustomIcon type='FontAwesome' name='credit-card' />
                </TouchableOpacity>
            </View> */}
            <View style={{ marginTop: moderateScale(20) }} />
            <WalletCard />


            <View
                style={[
                    globalStyle.betweenCenter,
                    { marginVertical: moderateScale(10) },
                ]}>
                <CustomButton
                    title="Add Amount"
                    weight="700"
                    textColor={isKyc == 1 ? "#000" : "#fff"}
                    bg={isKyc != 0 ? Colors.orange : "#000"}
                    customStyle={{ width: isKyc == 1 ? '45%' : "100%" }}
                    onPress={() => {
                        setAmountModal(true);
                    }}
                />
                {
                    isKyc == 1 && <CustomButton
                        title="Withdraw Amount"
                        customStyle={{ width: '45%', marginTop: moderateScale(5) }}
                        onPress={() => { setWithdrawModalModal(true) }}
                    />
                }

            </View>
            {
                isKyc == 1 && <TouchableOpacity
                    onPress={() => {
                        setIsAccountModal(true);
                    }}
                    style={{ alignItems: 'flex-end', marginBottom: moderateScale(5) }}>
                    <CustomText text="+ Add Account" weight="500" color="#707070" />
                </TouchableOpacity>
            }


            {IsAccountModal && (
                <CustomModal
                    iscenter={false}
                    containerStyle={{ height: '70%', width: '100%' }}
                    visible={IsAccountModal}
                    onDismiss={() => setIsAccountModal(false)}>
                    <View
                        style={{
                            width: moderateScale(100),
                            backgroundColor: Colors.gray,
                            height: moderateScale(3.5),
                            borderRadius: moderateScale(10),
                            alignSelf: 'center',
                            marginTop: moderateScale(5),
                        }}
                    />
                    <Formik
                        initialValues={{
                            accountHolder: '',
                            bankName: '',
                            accountNumber: '',
                            confirmAccountNumber: '',
                            ifscCode: '',
                        }}
                        validationSchema={addAccountSchema}
                        onSubmit={values => {
                            handleSaveAccount(values)
                        }}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            setFieldValue
                        }) => (
                            <KeyboardAvoidingView style={{ flex: 1 }}>
                                <CustomText
                                    text="Add Account"
                                    size={18}
                                    weight="600"
                                    customStyle={{
                                        marginTop: moderateScale(10),
                                        textAlign: 'center',
                                    }}
                                />
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{ paddingHorizontal: moderateScale(5) }}>
                                    {/* Account Holder */}
                                    <CustomInput
                                        text="Account Holder Name"
                                        placeholder="Enter Account Holder Name"
                                        customStyle={{
                                            width: '98%',
                                            alignSelf: 'center',
                                            marginBottom: moderateScale(5),
                                        }}
                                        handleChangeText={handleChange('accountHolder')}
                                        value={values?.accountHolder}
                                    />
                                    {touched.accountHolder && errors.accountHolder && (
                                        <Text style={{ color: 'red' }}>{errors.accountHolder}</Text>
                                    )}

                                    {/* Branch Name */}
                                    <CustomInput
                                        text="Bank Name"
                                        placeholder="Enter Bank Name"
                                        customStyle={{
                                            width: '98%',
                                            alignSelf: 'center',
                                            marginBottom: moderateScale(5),
                                        }}
                                        handleChangeText={handleChange('bankName')}
                                        value={values.bankName}
                                    />
                                    {touched.bankName && errors.bankName && (
                                        <Text style={{ color: 'red' }}>{errors.bankName}</Text>
                                    )}

                                    {/* Account Number */}
                                    <CustomInput
                                        text="Account Number"
                                        placeholder="Enter Account Number"
                                        maxLength={20}
                                        keyboardType="numeric"
                                        customStyle={{
                                            width: '98%',
                                            alignSelf: 'center',
                                            marginBottom: moderateScale(5),
                                        }}
                                        handleChangeText={handleChange('accountNumber')}
                                        value={values.accountNumber}
                                    />
                                    {touched.accountNumber && errors.accountNumber && (
                                        <Text style={{ color: 'red' }}>{errors.accountNumber}</Text>
                                    )}

                                    {/* Confirm Account Number */}
                                    <CustomInput
                                        text="Confirm Account Number"
                                        placeholder="Re-enter Account Number"
                                        maxLength={20}
                                        keyboardType="numeric"
                                        customStyle={{
                                            width: '98%',
                                            alignSelf: 'center',
                                            marginBottom: moderateScale(5),
                                        }}
                                        handleChangeText={handleChange('confirmAccountNumber')}
                                        value={values.confirmAccountNumber}
                                    />
                                    {touched.confirmAccountNumber &&
                                        errors.confirmAccountNumber && (
                                            <Text style={{ color: 'red' }}>
                                                {errors.confirmAccountNumber}
                                            </Text>
                                        )}

                                    {/* IFSC Code */}
                                    <CustomInput
                                        text="IFSC Code"
                                        placeholder="Enter IFSC Code"
                                        customStyle={{
                                            width: '98%',
                                            alignSelf: 'center',
                                            marginBottom: moderateScale(5),
                                        }}
                                        handleChangeText={handleChange('ifscCode')}
                                        value={values.ifscCode}
                                    />
                                    {touched.ifscCode && errors.ifscCode && (
                                        <Text style={{ color: 'red' }}>{errors.ifscCode}</Text>
                                    )}

                                    {/* Submit Button */}
                                    <CustomButton
                                        title="Save"
                                        customStyle={{ marginVertical: moderateScale(10) }}
                                        onPress={handleSubmit}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </ScrollView>
                            </KeyboardAvoidingView>
                        )}
                    </Formik>
                </CustomModal>
            )}

            {
                amountModal && <AddAmountCard title="Add Amount" handlePayment={(amount: number) => { handleAddAmount(amount) }} isAddAmount={true} visiable={amountModal} onDismiss={() => setAmountModal(false)} />
            }

            {
                isKyc != 0 && withdrawModal && <AddAmountCard title="Withdraw Amount" isAddAmount={false} visiable={withdrawModal} onDismiss={() => setWithdrawModalModal(false)} />
            }

            <View>
                <CustomText text="Transactions" weight="700" size={18} />
                <WalletTransaction />
            </View>
        </Container>
    );
}

export default Payments

const styles = StyleSheet.create({})