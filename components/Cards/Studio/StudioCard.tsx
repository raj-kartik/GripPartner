import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../../Customs/CustomText'
import Colors from '../../../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { moderateScale } from '../../Matrix/Matrix'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { globalStyle } from '../../../utils/GlobalStyle'
import CustomIcon from '../../Customs/CustomIcon'
import CustomModal from '../../Customs/CustomModal'
import CustomButton from '../../Customs/CustomButton'
import makeApiRequest from '../../../utils/ApiService'
import { BASE_URL, POST_DELETE_STUDIO } from '../../../utils/api'
import CustomToast from '../../Customs/CustomToast'

const StudioCard = ({ item, onDelete }: any) => {
    const [deleteModal, setDeleteModal] = React.useState(false);
    const navigation = useNavigation();
    const swipeableRef = React.useRef<any>(null); // <- added

    const rightSwipeArray = [

        {
            text: 'Edit',
            backgroundColor: Colors.button,
            color: '#fff',
            icon: <CustomIcon type='Feather' name='edit' color='#fff' size={30} />,
            onPress: () => {
                navigation.navigate("StudioEdit", {
                    item: item
                })
            }
        },
        {
            text: 'Delete',
            backgroundColor: Colors.red,
            color: '#fff',
            icon: <CustomIcon type='MaterialCommunityIcons' name='delete-empty' color='#fff' size={30} />,
            onPress: () => {
                setDeleteModal(true);
                swipeableRef.current?.close(); // <- close swipe
            }
        },

    ]

    const onRightSwipe = () => (
        <View style={[globalStyle.betweenCenter, styles.swipe]}>
            {
                rightSwipeArray.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={item.onPress}
                        style={[globalStyle.center, { backgroundColor: item.backgroundColor, height: "95%", borderRadius: moderateScale(8), marginRight: moderateScale(5), width: "48%" }]}
                    >
                        {item.icon}
                        <CustomText text={item.text} color='#fff' weight='500' />
                    </Pressable>
                ))
            }
            {/* <Pressable
                onPress={() => setDeleteModal(true)}
                style={[globalStyle.center, styles.swipe]}
            >
                <CustomIcon type='MaterialCommunityIcons' name='delete-empty' color='#fff' size={30} />
                <CustomText text='Delete' color='#fff' weight='600' />
            </Pressable> */}
        </View>
    );

    const handleDelete = async () => {
        try {
            const response: any = await makeApiRequest({
                url: POST_DELETE_STUDIO,
                method: "POST",
                data: { studio_id: item?.id },
                baseUrl: BASE_URL
            });

            if (response?.success) {
                setDeleteModal(false);
                swipeableRef.current?.close(); // <- close swipe
                CustomToast({
                    type: "success",
                    text1: "Studio Deleted Successfully!",
                    text2: response?.message
                });
                onDelete();
            } else {
                setDeleteModal(false);
                CustomToast({
                    type: "error",
                    text1: "Invalid Studio Information!",
                    text2: response?.message === 'studio_id is required.' && "Studio Information is invalid"
                });
            }
        } catch (err) {
            console.log("Error in deleting the studio", err);
        }
    };

    return (
        <Swipeable ref={swipeableRef} renderRightActions={onRightSwipe}>
            <Pressable onPress={() => {
                navigation.navigate("StudioDetail", {
                    item: item
                });
            }} style={styles.studioCard}>
                <CustomText text={item?.studio_name || "No Name"} weight='600' size={24} />
                <CustomText color={Colors.gray_font} text={item?.location || "No Location"} weight='500' size={16} />
                <CustomText color={Colors.gray_font} text={item?.email || "No E-mail"} weight='500' size={14} />
                <View style={[styles.deleteView]}>
                    <View style={[styles.secondView]} />
                </View>
            </Pressable>

            {deleteModal && (
                <CustomModal
                    containerStyle={{ height: moderateScale(150) }}
                    visible={deleteModal}
                    iscenter={true}
                    onDismiss={() => setDeleteModal(false)}
                >
                    <View style={[globalStyle.modalbar]} />
                    <CustomText text="Delete Studio" customStyle={{ textAlign: "center" }} weight='500' size={18} />
                    <View style={[globalStyle.center, { flex: 1, marginVertical: moderateScale(10) }]}>
                        <CustomText text='Do you confirm? You want to delete this studio' weight='500' size={16} />
                        <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(10), width: "95%" }]}>
                            <CustomButton
                                onPress={() => {
                                    setDeleteModal(false);
                                    swipeableRef.current?.close(); // <- close swipe on cancel
                                }}
                                customStyle={{ width: "45%" }}
                                title='No'
                                bg={Colors.orange}
                            />
                            <CustomButton
                                onPress={handleDelete}
                                title='Yes'
                                bg={"#000"}
                                customStyle={{ width: "45%" }}
                            />
                        </View>
                    </View>
                </CustomModal>
            )}
        </Swipeable>
    );
};

export default StudioCard

const styles = StyleSheet.create({
    studioCard: {
        // marginHorizontal:moderateScale(10),
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        backgroundColor: '#f7f7f7',
        marginBottom: moderateScale(5),
        marginTop: moderateScale(3),
        height: moderateScale(130),
        elevation: 2,
        marginHorizontal: moderateScale(5),
        overflow: "hidden"
        // alignSelf:'center',
    },
    deleteView: {
        position: 'absolute',
        bottom: -moderateScale(10),
        backgroundColor: Colors.orange_bg,
        padding: moderateScale(5),
        borderRadius: moderateScale(50),
        elevation: 2,
        width: moderateScale(80),
        height: moderateScale(80),
        right: -moderateScale(30),
        // overflow: 'hidden',
    },
    secondView: {
        position: 'absolute',
        bottom: -moderateScale(20),
        backgroundColor: Colors.orange_blur,
        padding: moderateScale(5),
        borderRadius: moderateScale(50),
        width: moderateScale(80),
        height: moderateScale(80),
        right: moderateScale(30),
        overflow: 'hidden',
    },
    swipe: {
        // backgroundColor: "#f7f7f7",
        flex: .4,
        borderRadius: moderateScale(10),
        marginBottom: moderateScale(5),
        marginTop: moderateScale(3),
        height: "100%",
        paddingVertical: moderateScale(5)
    }
})