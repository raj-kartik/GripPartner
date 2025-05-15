import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2';
import { getStudioList } from '../../../../../redux/Slice/StudioSlice';
import { moderateScale } from '../../../../../components/Matrix/Matrix';
import Images from '../../../../../utils/Images';
import Container from '../../../../../components/Container';
import CustomIcon from '../../../../../components/Customs/CustomIcon';
import Colors from '../../../../../utils/Colors';
import { globalStyle } from '../../../../../utils/GlobalStyle';
import CustomText from '../../../../../components/Customs/CustomText';
import StudioCard from '../../../../../components/Cards/Studio/StudioCard';
import StudioSkeelton from '@components/Skeleton/StudioSkeelton';

const Studios = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.user);
    const { studio, loading } = useSelector((state: any) => state.studio);
    const navigation = useNavigation();
    // console.log("--- studio ----", studio);

    useFocusEffect(
        useCallback(() => {
            studioList();
        }, []),
    );

    const studioList = async () => {
        await dispatch(getStudioList(user?.id));
    };

    return (
        <Container>
            <CustomHeader2 title="Studios" isMore={true} iconType="AntDesign" iconName="plus" handleMore={() => {
                navigation.dispatch(
                    CommonActions.navigate({
                        // name: 'NewCourseScreen',
                        name: 'UpdateStudioProfile',
                    }),
                );
            }} />

            {/* <StudioSkeelton/> */}

            {
                loading ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        keyExtractor={item => item}
                        renderItem={() => (
                            <StudioSkeelton />
                        )}
                    />
                ) : (
                    <>
                        {
                            studio && studio.length > 0 ? (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={studio}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }: any) => {
                                        // console.log("item in the studio list", item);

                                        return (
                                            <StudioCard item={item} onDelete={() => {
                                                studioList();
                                            }} />
                                        )
                                    }}
                                />
                            ) : (
                                <View>
                                    <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
                                </View>
                            )
                        }
                    </>
                )
            }

        </Container>
    );
};

export default Studios;

const styles = StyleSheet.create({

});
