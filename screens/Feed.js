import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Platform,
	StatusBar,
	Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ComputerCard from './ComputerCard';

import * as Font from 'expo-font';
import { FlatList } from 'react-native-gesture-handler';

import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import db from '../config';

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
	'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

let computers = require('./temp_computers.json');

export default class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
			light_theme: true,
			computers: [],
		};
	}

	async _loadFontsAsync() {
		await Font.loadAsync(customFonts);
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this._loadFontsAsync();
		this.fetchcomputers();
		this.fetchUser();
	}

	fetchcomputers = () => {
		onValue(ref(db, '/posts/'), (snapshot) => {
			let computers = [];
			if (snapshot.val()) {
				Object.keys(snapshot.val()).forEach(function (key) {
					computers.push({
						key: key,
						value: snapshot.val()[key],
					});
				});
			}
			this.setState({ computers: computers });
			this.props.setUpdateToFalse();
		});
	};

	async fetchUser() {
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

	renderItem = ({ item: computers }) => {
		return <computersCard computers={computers} navigation={this.props.navigation} />;
	};

	keyExtractor = (item, index) => index.toString();

	render() {
		if (this.state.fontsLoaded) {
			SplashScreen.hideAsync();
			return (
				<View
					style={this.state.light_theme ? styles.containerLight : styles.container}>
					<SafeAreaView style={styles.droidSafeArea} />
					<View style={styles.appTitle}>
						<View style={styles.appIcon}>
							<Image
								source={require('../assets/logo.png')}
								style={styles.iconImage}></Image>
						</View>
						<View style={styles.appTitleTextContainer}>
							<Text
								style={
									this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText
								}>
								Computers Review App
							</Text>
						</View>
					</View>
					{!this.state.computers[0] ? (
						<View style={styles.noComputers}>
							<Text
								style={
									this.state.light_theme
										? styles.noComputersTextLight
										: styles.noComputersText
								}>
								No Computers Review Available
							</Text>
						</View>
					) : (
						<View style={styles.cardContainer}>
							<FlatList
								keyExtractor={this.keyExtractor}
								data={this.state.computers}
								renderItem={this.renderItem}
							/>
						</View>
					)}
					<View style={{ flex: 0.15 }} />
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({	
	container: {
		flex: 1,
		backgroundColor: '#15193c',
	},
	containerLight: {
		flex: 1,
		backgroundColor: 'white',
	},
	droidSafeArea: {
		marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
	},
	appTitle: {
		flex: 0.07,
		flexDirection: 'row',
	},
	appIcon: {
		flex: 0.3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	appTitleTextContainer: {
		flex: 0.7,
		justifyContent: 'center',
	},
	appTitleText: {
		color: 'white',
		fontSize: RFValue(28),
		fontFamily: 'Bubblegum-Sans',
	},
	appTitleTextLight: {
		color: 'black',
		fontSize: RFValue(28),
		fontFamily: 'Bubblegum-Sans',
	},
	cardContainer: {
		flex: 0.85,
	},
	noComputers: {
		flex: 0.85,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noComputerTextLight: {
		fontSize: RFValue(40),
		fontFamily: 'Bubblegum-Sans',
	},
	noComputersText: {
		color: 'white',
		fontSize: RFValue(40),
		fontFamily: 'Bubblegum-Sans',
	},
});
