import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../../components/Container'
import { useSelector } from 'react-redux'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'

const UpdateProfile = () => {

    const { user } = useSelector((state: any) => state?.user);

    return (
        <Container>
            <CustomHeader2 title="Profile" />
        </Container>
    )
}

export default UpdateProfile

const styles = StyleSheet.create({})