import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';
import { CustomToast } from "../../components/Customs/CustomToast";
import makeApiRequest from "../../utils/ApiService";
import { DEFAULT_URL, STORE_API } from "../../utils/api";
import Container from "../../components/Container";
import CustomButton from "../../components/Customs/CustomButton";
import { globalStyle } from "../../utils/GlobalStyle";
import CustomIcon from "../../components/Customs/CustomIcon";
import Colors from "../../utils/Colors";
import CustomText from "../../components/Customs/CustomText";
import { moderateScale, screenHeight, screenWidth } from "../../components/Matrix/Matrix";

const Scanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scannedItems, setScannedItems] = useState([]); // Store scanned items and responses
    const [loading, setLoading] = useState(false);
    const [scanDisabled, setScanDisabled] = useState(false); // Disable scanning for cooldown
    const device = useCameraDevice('back');
    const { user } = useSelector((state: any) => state.user);

    // console.log("==== user in the scanner ====",user?.id);

    const [eanText, setEanText] = useState('');

    const navigation = useNavigation();

    const handleScanCode = async (codeValue: any) => {
        const userId = user?.id;

        if (!userId) {
            CustomToast({
                type: 'error',
                text1: 'User not found',
                text2: 'Unable to process the scan.',
            });
            return;
        }

        try {
            setLoading(true);
            setScanDisabled(true); // Disable scanning immediately

            // console.log('==== code value ===', codeValue);

            const response: any = await makeApiRequest({
                baseUrl: DEFAULT_URL,
                method: 'POST',
                url: `${STORE_API}/scan-and-add-to-cart`,
                data: { user_id: userId, ean_no: codeValue },
            });


            console.log("==== response in the scanner =====", response);


            Vibration.vibrate(1000, false);

            if (response?.status === 'success') {
                setScannedItems(prevItem => {
                    const itemIndex = prevItem.findIndex(
                        (item: any) => item?.product_id === response?.data?.product_id,
                    );
                    if (itemIndex !== -1) {
                        const updatedItems: any = [...prevItem];
                        updatedItems[itemIndex] = response.data;
                        return updatedItems;
                    }
                    return [...prevItem, response.data];
                });

                CustomToast({
                    type: 'success',
                    text1: 'Product Added',
                    text2: 'Product added successfully.',
                });

                Vibration.cancel();
                setScanDisabled(false); // Re-enable scanning only after success
            } else {
                // console.log('---- response ----', response);
                CustomToast({
                    type: 'error',
                    text1: 'Failed to Add',
                    text2: 'Unable to add the product to cart.',
                });

                Vibration.cancel();
                setTimeout(() => setScanDisabled(false), 5000); // Allow re-scan after 5s in case of failure
            }
        } catch (error) {
            console.log('Error in adding product:', error);
            CustomToast({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong.',
            });

            setTimeout(() => setScanDisabled(false), 5000); // Allow re-scan after 5s in case of error
        } finally {
            setLoading(false);
        }
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128'],
        onCodeScanned: (codes: any) => {
            if (codes.length > 0 && !scanDisabled) {
                const codeValue = codes[0]?.value;
                if (codeValue) {
                    handleScanCode(codeValue);
                }
            }
        },
    });

    // console.log('----- scannedItems ------', scannedItems);
    useEffect(() => {
        const requestCameraPermission = async () => {
            const status = await Camera.getCameraPermissionStatus();
            if (status !== 'granted') {
                const requestStatus = await Camera.requestCameraPermission();
                setHasPermission(requestStatus === 'granted');
            } else {
                setHasPermission(true);
            }
        };
        requestCameraPermission();
    }, []);

    const handleRequestPermission = async () => {
        const requestStatus = await Camera.requestCameraPermission();
        setHasPermission(requestStatus === 'granted');
    };

    if (!hasPermission) {
        return (
            <Container>
                {/* <CustomHeader1 title="Scanner" /> */}
                <View style={styles.centered}>
                    <Text style={styles.text}>
                        Camera permission is required to use the scanner.
                    </Text>
                    <CustomButton title="Grant Permission" onPress={handleRequestPermission} />
                </View>
            </Container>
        );
    }

    if (!device) {
        return (
            <Container>
                {/* <CustomHeader1 title="Scanner" /> */}
                <View style={styles.centered}>
                    <Text style={styles.text}>No camera device available.</Text>
                </View>
            </Container>
        );
    }

    return (
        <Container>
            {/* <CustomHeader1 title="Scanner" /> */}
            <View style={{ flex: 1, width: screenWidth, alignSelf: "center", paddingHorizontal: moderateScale(10) }} >
                <View style={[styles.inputContainer, globalStyle.row]}>
                    <CustomIcon type="AntDesign" name="search1" />
                    <TextInput
                        keyboardType="numeric"
                        style={styles.textInput}
                        placeholderTextColor={Colors.gray_font}
                        placeholder="Enter EAN Number"
                        maxLength={13}
                        value={eanText}
                        onChangeText={(text: string) => {
                            setEanText(text);
                        }}
                    />
                    {eanText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                eanText.length >= 13
                                    ? handleScanCode(eanText)
                                    : CustomToast({
                                        type: 'error',
                                        text1: 'Invalid EAN',
                                        text2: 'Please enter a valid EAN number.',
                                    });
                            }}
                            style={[
                                globalStyle.center,
                                {
                                    backgroundColor: '#000',
                                    height: '80%',
                                    width: '20%',
                                    borderRadius: moderateScale(5),
                                },
                            ]}>
                            <CustomText text="Add" color="#fff" size={16} weight="500" />
                        </TouchableOpacity>
                    )}
                </View>
                <Camera
                    // codeScanner={ codeScanner}
                    codeScanner={codeScanner}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                />
                {loading && (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Processing...</Text>
                    </View>
                )}
            </View>

            <View style={{ flex: .2, width: screenWidth, alignSelf: "center", paddingHorizontal: moderateScale(10), backgroundColor: "#fff" }} >
                {scannedItems.length > 0 && (
                    <View
                        style={{
                            width: screenWidth,
                            alignSelf: 'center',
                            backgroundColor: "#fff",
                            paddingHorizontal: moderateScale(10),
                            flex: 1,
                            paddingTop: moderateScale(20)
                        }}>
                        <CustomButton
                            onPress={() =>
                                navigation.navigate('ScannerCart', { cart: scannedItems || [] })
                            }
                            customStyle={{ elevation: 5 }}
                            title={`${scannedItems.length} Items Added`}
                        />
                    </View>
                )}
            </View>

            <View style={{ paddingBottom: moderateScale(100) }} />
        </Container>
    );
};

export default Scanner;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        borderRadius: 10,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        backgroundColor: '#fff',
        width: '100%',
        position: 'absolute',
        top: moderateScale(10),
        zIndex: 9,
        alignSelf: 'center',
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(10),
    },
    textInput: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        fontSize: moderateScale(15),
        borderRadius: moderateScale(8),
        color: '#000',
        height:moderateScale(50)
    },
});
