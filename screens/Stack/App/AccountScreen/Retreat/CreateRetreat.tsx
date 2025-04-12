import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { Form, Formik } from 'formik'

import { differenceInCalendarDays } from 'date-fns';
import CustomInput from '../../../../../components/Customs/CustomInput'
import { moderateScale } from '../../../../../components/Matrix/Matrix'

const retreatSchema = yup.object().shape({
    title: yup.string().min(3, '*too short').max(50, '*too long'),
    hotel: yup.string().min(3, '*too short').max(50, '*too long'),
    location: yup.string().min(3, '*too short').max(50, '*too long'),
    overview: yup.string().min(3, '*too short').max(200, '*too long'),
    details: yup.string().min(3, '*too short').max(500, '*too long'),
    groupSize: yup.number().positive().integer(),
    numOfDays: yup.number()
        .positive()
        .integer()
        .test('days-match', 'Number of days does not match date range', function (value) {
            const { startDate, endDate } = this.parent;
            if (startDate && endDate && value) {
                const diff = differenceInCalendarDays(new Date(endDate), new Date(startDate));
                return value === diff + 1;
            }
            return true;
        }),
    numOfNights: yup.number().positive().integer(),
    price: yup.number().positive(),
    img: yup.mixed(),
    startDate: yup.date().required('*Start date is required'),
    endDate: yup.date()
        .required('*End date is required')
        .min(
            yup.ref('startDate'),
            '*End date cannot be before start date'
        ),
});

const CreateRetreat = () => {

    const roomArray = [
        {
            id: 1,
            label: "Single room"
        },
    ]
    return (
        <Container>
            <CustomHeader2 title="Create Retreat" />

            <KeyboardAvoidingView style={{ flex: 1 }} >
                <Formik
                    initialValues={{
                        title: '',
                        hotel: '',
                        location: '',
                        overview: '',
                        details: '',
                        groupSize: '',
                        numOfDays: '',
                        numOfNights: '',
                        price: '',
                        img: null,
                        startDate: '',
                        endDate: ''
                    }}
                    validationSchema={retreatSchema}
                    onSubmit={(values) => {
                        console.log('Submitted:', values);
                    }}

                >
                    {({ handleSubmit, handleChange, setFieldValue, errors, values, touched }) => (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ flex: 1, paddingHorizontal:moderateScale(5) }}
                        >
                            <CustomInput
                                text='Title'
                                value={values?.title}
                                handleChangeText={handleChange('title')}
                            />

                            <CustomInput
                                text='No. of Days'
                                keyboardType='number-pad'
                                value={values?.numOfDays}
                                handleChangeText={handleChange('numOfDays')}
                                />

                            <CustomInput
                                text='No. of Nights'
                                keyboardType='number-pad'
                                value={values?.numOfNights}
                                handleChangeText={handleChange('numOfNights')}
                            />

                            <CustomInput
                                text='Price'
                                value={values?.price}
                                keyboardType='number-pad'
                                handleChangeText={handleChange('price')}
                            />

                            <CustomInput
                                text='Group Size'
                                value={values?.groupSize}
                                keyboardType='number-pad'
                                handleChangeText={handleChange('groupSize')}
                            />

                            <CustomInput
                                text='Overview'
                                value={values?.overview}
                                multiline={true}
                                numOfLine={10}
                                handleChangeText={handleChange('overview')}
                                />

                            <CustomInput
                                text='Program Detail'
                                multiline={true}
                                numOfLine={20}
                                value={values?.details}
                                handleChangeText={handleChange('details')}
                            />
                        </ScrollView>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </Container>
    )
}

export default CreateRetreat

const styles = StyleSheet.create({})