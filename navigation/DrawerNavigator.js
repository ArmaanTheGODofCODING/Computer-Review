import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import Logout from '../screens/Logout';

import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';					
import db from '../config';

import CustomSidebarMenu from '../screens/CustomSidebarMenu';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			light_theme: true,
		};
	}

	componentDidMount() {
		let theme;
		const auth = getAuth();
		const userId = auth.currentUser.uid;

		onValue(ref(db, '/users/' + userId), (snapshot) => {
			theme = snapshot.val().current_theme;
			this.setState({
				light_theme: theme === 'light' ? true : false,
			});
		});
	}

	render() {
		let props = this.props;
		return (
			<Drawer.Navigator
				drawerContent={(props) => <CustomSidebarMenu {...props} />}
				screenOptions={{
					headerShown: false,
					drawerActiveTintColor: '#e91e63',
					drawerInactiveTintColor: 'grey',
					itemStyle: { marginVertical: 5 },
				}}>
				<Drawer.Screen
					name='MyHome'
					component={StackNavigator}
					options={{ unmountOnBlur: true }}
				/>
				<Drawer.Screen
					name='Profile'
					component={Profile}
					options={{ unmountOnBlur: true }}
				/>
				<Drawer.Screen
					name='Logout'
					component={Logout}
					options={{ unmountOnBlur: true }}
				/>
			</Drawer.Navigator>
		);
	}
}
