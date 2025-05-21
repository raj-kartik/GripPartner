import {
    FlatList,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useState } from 'react';
import Container from '@components/Container';
import CustomHeader2 from '@components/Customs/Header/CustomHeader2';
import CustomText from '@components/Customs/CustomText';
import { moderateScale } from '@components/Matrix/Matrix';
import CustomButton from '@components/Customs/CustomButton';
import Colors from '@utils/Colors';
import { useSelector } from 'react-redux';
import CustomInput from '@components/Customs/CustomInput';
import * as yup from 'yup';
import { Formik } from 'formik';
import { globalStyle } from '@utils/GlobalStyle';
import makeApiRequest from '@utils/ApiService';
import {
    BASE_URL,
    POST_PAN_UPDATE,
    POST_PERSONAL_PAN_VERIFICATION,
    POST_STUDIO_PAN_VERIFICATION,
} from '@utils/api';
import CustomToast from '@components/Customs/CustomToast';
import { useNavigation } from '@react-navigation/native';

const panSchema = yup.object().shape({
    panNumber: yup
        .string()
        .required('*required')
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, '*invalid PAN format'),
    panType: yup.string().required('*required'),
});

const PanVerification = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [panLoading, sePanLoading] = useState<boolean>(false);
    const { user } = useSelector((state: any) => state?.user);
    const [panData, setPanData] = useState<any>(null);
    const [panText, setPanText] = useState<string>('');
    const [panGST, setPanGST] = useState<any>([]);
    const [selectPan, setSelectPan] = useState<any>({});

    const handlePan = async ({ pan, type }: any) => {
        sePanLoading(true);
        try {
            const response: any = await makeApiRequest({
                url:
                    type === 'own'
                        ? POST_PERSONAL_PAN_VERIFICATION
                        : POST_STUDIO_PAN_VERIFICATION,
                baseUrl: BASE_URL,
                method: 'POST',
                data: {
                    pan: pan,
                },
            });

            if (response?.status === 'success') {
                if (type === 'own') {
                    setPanData(response?.data?.data);
                } else {
                    setPanGST(response?.data?.data);
                    setSelectPan(response?.data?.data[0]);
                }
                CustomToast({
                    type: 'success',
                    text1: 'PAN information fetches successfully',
                    text2: '',
                });
            }

            console.log('---- respons ein the pan verificaitio -----', response);
        } catch (err: any) {
            console.error('Error in the PAN Card verification:', err);
        } finally {
            sePanLoading(false);
        }
    };

    const panTypeArray = [
        {
            id: 1,
            label: 'Own PAN Card',
            value: 'own',
        },
        {
            id: 2,
            label: 'Studio PAN Card',
            value: 'studio',
        },
    ];

    // console.log('panData -----', panGST);

    const handleSavePanCard = async (values: any) => {
        try {
            const response: any = await makeApiRequest({
                url: POST_PAN_UPDATE,
                method: "POST",
                baseUrl: BASE_URL,
                data: {
                    user_id: user?.id,
                    pan: selectPan?.pan,
                    gst: selectPan?.gstin,
                },
            });


            console.log("---- response in the handle save pan card -----", response);

        } catch (err: any) {
            console.error('Error in the saving PAN card', err);
        }
        navigation.navigate('IsAddStudio');
    };

    return (
        <Container>
            <CustomHeader2 title="PAN Verification" />

            <Pressable onPress={() => {
                navigation.navigate('BottomTabs')
            }} style={{ position: "absolute", top: moderateScale(10), right: moderateScale(30), zIndex: 10 }} >
                <CustomText text='Skip' color={Colors.gray_font} />
            </Pressable>

            <View style={{ flex: 1, marginTop: moderateScale(10) }}>
                <CustomText text="Add Your PAN" weight="600" size={22} />
                <View style={{ marginTop: moderateScale(10), flex: 1 }}>
                    <Formik
                        initialValues={{
                            panNumber: panText,
                            panType: '',
                        }}
                        onSubmit={(values: any) => {
                            // if()
                            handleSavePanCard(values);
                        }}
                        validationSchema={panSchema}>
                        {({
                            handleSubmit,
                            handleChange,
                            setFieldValue,
                            errors,
                            values,
                            touched,
                        }: any) => (
                            <KeyboardAvoidingView style={{ flex: 1 }}>
                                <ScrollView
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    style={{ paddingHorizontal: moderateScale(0) }}>
                                    <CustomText text="PAN Type" weight="500" />
                                    <View
                                        style={[
                                            globalStyle.betweenCenter,
                                            { padding: moderateScale(5) },
                                        ]}>
                                        {panTypeArray.map((item, index) => {
                                            return (
                                                <Pressable
                                                    key={index}
                                                    style={[globalStyle.row]}
                                                    onPress={() => {
                                                        setFieldValue('panType', item?.value);
                                                    }}>
                                                    <View
                                                        style={[
                                                            globalStyle.center,
                                                            styles.outerRadio,
                                                            {
                                                                borderColor:
                                                                    values?.panType === item?.value
                                                                        ? Colors.activeRadio
                                                                        : '#000',
                                                            },
                                                        ]}>
                                                        <View
                                                            style={[
                                                                styles.innerRadio,
                                                                {
                                                                    backgroundColor:
                                                                        values?.panType === item?.value
                                                                            ? Colors.activeRadio
                                                                            : '#fff',
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                    <CustomText
                                                        customStyle={{ marginLeft: moderateScale(5) }}
                                                        text={item?.label}
                                                        weight="500"
                                                    />
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                    {errors?.panType && touched?.panType && (
                                        <CustomText
                                            customStyle={{ marginTop: moderateScale(4) }}
                                            text={errors?.panType || ''}
                                            color={Colors.red}
                                        />
                                    )}

                                    <View
                                        style={[
                                            globalStyle.flex,
                                            {
                                                alignItems: 'flex-end',
                                                width: '98%',
                                                alignSelf: 'center',
                                            },
                                        ]}>
                                        <CustomInput
                                            text="PAN Number"
                                            customStyle={{ flex: 1.5 }}
                                            placeholder="Eg. AAAAA9999A"
                                            values={panText}
                                            handleChangeText={(text: string) => {
                                                setPanText(text.toUpperCase());
                                                setFieldValue('panNumber', text.toUpperCase());
                                            }}
                                            autoCapitalize="characters"
                                            maxLength={10}
                                        />

                                        <View style={{ flex: 1, marginLeft: moderateScale(5) }}>
                                            <CustomButton
                                                title="Verify"
                                                loading={panLoading}
                                                disabled={panLoading}
                                                // customStyle={{ width: "45%" }}
                                                onPress={() => {
                                                    // console.log("---- pna type ----", values?.panType);
                                                    // return;

                                                    if (panText.length >= 10) {
                                                        handlePan({
                                                            pan: panText.toUpperCase(),
                                                            type: values?.panType,
                                                        });
                                                    } else {
                                                        CustomToast({
                                                            type: 'info',
                                                            text1: 'Invalid PAN Number',
                                                            text2: 'Please fill valid PAN',
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                    {errors?.panNumber && touched?.panNumber && (
                                        <CustomText
                                            customStyle={{ marginTop: moderateScale(4) }}
                                            text={errors?.panNumber || ''}
                                            color={Colors.red}
                                        />
                                    )}

                                    <View>
                                        {panData ? (
                                            <View style={styles?.panCard}>
                                                <View>
                                                    <CustomText
                                                        size={13}
                                                        text="Name"
                                                        weight="500"
                                                        color={Colors.gray_font}
                                                    />
                                                    <CustomText
                                                        text={panData?.full_name}
                                                        size={20}
                                                        weight="500"
                                                    />
                                                </View>

                                                <View style={{ marginTop: moderateScale(5) }}>
                                                    <CustomText
                                                        size={13}
                                                        text="GST Number"
                                                        weight="500"
                                                        color={Colors.gray_font}
                                                    />
                                                    <CustomText
                                                        text={panData?.pan}
                                                        weight="500"
                                                        customStyle={{ marginTop: moderateScale(2) }}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: moderateScale(5),
                                                        right: moderateScale(10),
                                                    }}>
                                                    <CustomText
                                                        text={panData?.pan_type}
                                                        size={16}
                                                        weight="500"
                                                        color={Colors.gray_font}
                                                        customStyle={{ marginTop: moderateScale(2) }}
                                                    />
                                                </View>
                                            </View>
                                        ) : panGST && panGST.length > 0 ? (
                                            <View>
                                                <FlatList
                                                    data={panGST}
                                                    keyExtractor={(item: any, index: number) => index}
                                                    renderItem={({ item }) => (
                                                        <Pressable
                                                            onPress={() => {
                                                                setSelectPan(item);
                                                            }}
                                                            style={[
                                                                styles?.panCard,
                                                                {
                                                                    backgroundColor:
                                                                        item?.gstin === selectPan?.gstin
                                                                            ? Colors.orange_bg
                                                                            : '#fff',
                                                                    borderWidth:
                                                                        item?.gstin === selectPan?.gstin ? 1 : 0,
                                                                },
                                                            ]}>
                                                            <View style={{ marginBottom: moderateScale(5) }}>
                                                                <CustomText
                                                                    size={13}
                                                                    text="GST Number"
                                                                    weight="500"
                                                                    color={Colors.gray_font}
                                                                />
                                                                <CustomText
                                                                    text={item?.gstin}
                                                                    size={20}
                                                                    weight="500"
                                                                />
                                                            </View>
                                                            <View>
                                                                <CustomText
                                                                    text="State"
                                                                    size={13}
                                                                    weight="500"
                                                                    color={Colors.gray_font}
                                                                />
                                                                <CustomText
                                                                    text={item?.state}
                                                                    size={16}
                                                                    weight="500"
                                                                />
                                                            </View>

                                                            <View
                                                                style={{
                                                                    position: 'absolute',
                                                                    bottom: moderateScale(5),
                                                                    right: moderateScale(10),
                                                                }}>
                                                                <CustomText
                                                                    text={item?.status}
                                                                    size={16}
                                                                    weight="500"
                                                                    color={
                                                                        item?.status === 'Active'
                                                                            ? Colors.success
                                                                            : Colors.red
                                                                    }
                                                                    customStyle={{ marginTop: moderateScale(2) }}
                                                                />
                                                            </View>
                                                        </Pressable>
                                                    )}
                                                />
                                            </View>
                                        ) : (
                                            <View></View>
                                        )}
                                    </View>
                                </ScrollView>
                                <CustomButton
                                    title="Save"
                                    customStyle={{
                                        marginVertical: moderateScale(20),
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                    onPress={handleSubmit}
                                    loading={loading}
                                    disabled={loading}
                                    bg={Colors.orange}
                                />
                            </KeyboardAvoidingView>
                        )}
                    </Formik>
                </View>
            </View>
        </Container>
    );
};

export default PanVerification;

const styles = StyleSheet.create({
    outerRadio: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderWidth: 1.5,
        borderRadius: moderateScale(50),
    },
    innerRadio: {
        width: moderateScale(13),
        height: moderateScale(13),
        // backgroundColor: "#000",
        borderRadius: moderateScale(40),
    },
    panCard: {
        marginTop: moderateScale(10),
        elevation: 3,
        borderWidth: 1,
        borderRadius: moderateScale(10),
        backgroundColor: '#fff',
        height: moderateScale(100),
        padding: moderateScale(10),
    },
});
