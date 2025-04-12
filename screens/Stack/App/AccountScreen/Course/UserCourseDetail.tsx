import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'

interface Props {
    navigation: any;
    route: any;
}
const UserCourseDetail: FC<Props> = ({ navigation, route }) => {
    return (
        <Container>
            <CustomHeader2 title="Course Detail" />
        </Container>
    )
}

export default UserCourseDetail

const styles = StyleSheet.create({})