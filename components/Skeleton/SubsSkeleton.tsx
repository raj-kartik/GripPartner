import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from '@components/Matrix/Matrix'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { globalStyle } from '@utils/GlobalStyle'
import LinearGradient from 'react-native-linear-gradient'

const SubsSkeleton = () => {
  return (
    <View style={[globalStyle.row, styles.container]} >
      <ShimmerPlaceholder
        style={styles.img}
        LinearGradient={LinearGradient}
        duration={1500}
      />
      <View style={{ flex: 1, marginHorizontal: moderateScale(10) }} >

        <ShimmerPlaceholder
          style={styles.heading}
        />

        <ShimmerPlaceholder
          style={styles.heading}
          shimmerStyle={{ marginTop: moderateScale(5) }}
        />
      </View>
    </View>
  )
}

export default SubsSkeleton

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    height: moderateScale(80),
    borderRadius: moderateScale(10),
    backgroundColor: "#fff",
    elevation: 5,
    padding: moderateScale(5)
  },
  img: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(100)
  },
  heading: {
    width: "100%",
    height: moderateScale(20),
    borderRadius: moderateScale(3)
  }
})