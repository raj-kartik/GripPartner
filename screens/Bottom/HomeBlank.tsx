import { StyleSheet, Text, View } from 'react-native'

import React from 'react'
import { BottomTabs } from '../../components/BottomNav/BottomTab'

const HomeBlank = () => {
    return (
        <View style={{ flex: 1 }} >
            <BottomTabs />
        </View>
    )
}

export default HomeBlank

const styles = StyleSheet.create({})