import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppStack from './screens/Stack/App/AppStack'
import Container from './components/Container'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigation from './screens/Stack/AppNavigation'
import Toast from 'react-native-toast-message'
import Images from './utils/Images'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import store from './redux/store'


const App = () => {
  return (
    <GestureHandlerRootView>
      <Provider store={store} >
        <NavigationContainer>
          <AppNavigation />
          <Toast />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({})