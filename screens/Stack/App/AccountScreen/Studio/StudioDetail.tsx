import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '@components/Customs/CustomText'
import Container from '@components/Container'
import CustomHeader2 from '@components/Customs/Header/CustomHeader2'
import Images from '@utils/Images'
import { moderateScale } from '@components/Matrix/Matrix'
import { globalStyle } from '@utils/GlobalStyle'
import Colors from '@utils/Colors'
import CustomIcon from '@components/Customs/CustomIcon'
import SubHeader from '@components/Customs/Header/SubHeader1'

const StudioDetail = (props: any) => {

    console.log("item in the studio detail", props?.route?.params?.item);
    const { item } = props?.route?.params;

    return (
        <Container>
            <CustomHeader2 title="Studio Detail" />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.imageView, globalStyle.center]} >
                    {
                        item?.image ? (
                            <Image source={{ uri: item?.image }} style={{
                                height: moderateScale(140),
                                width: moderateScale(140),
                                borderRadius: moderateScale(140),
                            }} />
                        ) : (
                            <Images.Coin width={moderateScale(120)} height={moderateScale(120)} style={{
                                height: moderateScale(150),
                            }} />
                        )
                    }


                    <View style={[globalStyle.center, {
                        width: moderateScale(100),
                        height: moderateScale(30),
                        // height:moderateScale(20),
                        padding: moderateScale(5),
                        backgroundColor: Colors.orange_bg,
                        borderRadius: moderateScale(100),
                        position: "absolute",
                        bottom: -10,
                        right: -moderateScale(20),

                    }]} >
                        <CustomText
                            text={item?.studio_type}
                            weight='500'
                        />
                    </View>
                </View>

                {/* contact + email */}
                <View style={{ alignSelf: "center", }} >
                    <CustomText text={item?.studio_name} size={22} weight='600' customStyle={{ textAlign: 'center', marginTop: moderateScale(5) }} />
                    <View style={[globalStyle.center, { width: "100%", alignSelf: "center", marginVertical: moderateScale(10), flexDirection: "row" }]} >
                        <Pressable
                            onPress={() => {
                                if (item?.contact_number) {
                                    Linking.openURL(`tel:${item.contact_number}`);
                                }
                            }}
                            style={[globalStyle.row, { alignSelf: "center", flex: 1, justifyContent: "center", alignItems: "center" }]}
                        >
                            <CustomIcon type='Feather' name='phone' color={Colors.orange} />
                            <CustomText customStyle={{ marginLeft: moderateScale(5) }} text={`+91-${item?.contact_number}`} size={18} weight='500' color={Colors.gray_font} />
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                if (item?.email) {
                                    Linking.openURL(`mailto:${item.email}`);
                                }
                            }}
                            style={[globalStyle.row, { alignSelf: "center", flex: 1, justifyContent: "center", alignItems: "center" }]}
                        >
                            <CustomIcon type='Feather' name='mail' color={Colors.orange} />
                            <CustomText customStyle={{ marginLeft: moderateScale(5) }} text={item?.email} size={18} weight='500' color={Colors.gray_font} />
                        </Pressable>
                    </View>

                    {/* location */}
                    <View style={[globalStyle.center, { alignItems: "center", width: "100%", flexDirection: "row" }]} >
                        <CustomIcon
                            type='Ionicons'
                            name='location-sharp'
                            color={Colors.orange}
                        />
                        <CustomText
                            text={item?.location}
                            size={18}
                            weight='500'
                        />
                    </View>
                </View>

                <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(10), justifyContent: "space-evenly" }]} >

                    {/* opens at */}
                    <View style={[globalStyle.row]} >
                        <CustomIcon
                            type='MaterialCommunityIcons'
                            name='clock-time-four-outline'
                            color={Colors.orange}
                            size={30}
                        />
                        <View style={{ marginLeft: moderateScale(5) }} >
                            <CustomText text='Opens at' weight='500' color={Colors.gray} />
                            <CustomText text={item?.opening_time.slice(0, 5)} weight='600' />
                        </View>
                    </View>

                    {/* closes at */}
                    <View style={[globalStyle.row]} >
                        <CustomIcon
                            type='MaterialCommunityIcons'
                            name='clock-time-nine-outline'
                            color={Colors.orange}
                            size={30}
                        />
                        <View style={{ marginLeft: moderateScale(5) }} >
                            <CustomText text='Opens at' weight='500' color={Colors.gray} />
                            <CustomText text={item?.closing_time.slice(0, 5)} weight='600' />
                        </View>
                    </View>
                </View>

                {/* courses */}
                <View style={{ marginTop: moderateScale(10) }} >
                    <SubHeader title="Courses" isMore={true} />
                </View>

            </ScrollView>
        </Container>
    )
}

export default StudioDetail

const styles = StyleSheet.create({
    imageView: {
        alignSelf: "center",
        // backgroundColor:"red",
        borderRadius: moderateScale(200),
        borderWidth: 2,
        padding: moderateScale(5),
        borderColor: Colors.orange,
        width: moderateScale(150),
        height: moderateScale(150),
        marginBottom: moderateScale(15)
    }
})