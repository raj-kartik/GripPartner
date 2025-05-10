import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup';
import { Formik } from 'formik';


const StudioEdit = (props: any) => {
    return (
        <Container>
            <CustomHeader2 title="Studio Edit" />
        </Container>
    )
}

export default StudioEdit

const styles = StyleSheet.create({})