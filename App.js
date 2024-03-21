import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/Register';

import DrawerNavigator from './navigation/DrawerNavigator';

import db from './config';
import StackNavigator from './navigation/StackNavigator';

const Stack = createStackNavigator();

const stackNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName='Login'
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
			}}>
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='RegisterScreen' component={RegisterScreen} />
			<Stack.Screen name='Dashboard' component={DrawerNavigator} />
		</Stack.Navigator>
	);
};

export default function App() {
	return (
		<NavigationContainer>
			<StackNavigator />
		</NavigationContainer>
	);
}
