import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Platform,
	StatusBar,
	Image,
	Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';	
import * as Font from 'expo-font';

import { getAuth } from 'firebase/auth';
import { ref, onValue, increment, update } from 'firebase/database';
import db from '../config';

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
	'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class computerScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
			speakerColor: 'gray',
			speakerIcon: 'volume-high-outline',
			light_theme: true,
			is_liked:false,
			likes: this.props.computer.value.likes,

		};
	}

	async _loadFontsAsync() {
		await Font.loadAsync(customFonts);
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this._loadFontsAsync();
		this.fetchUser();
	}
	likeAction = ()=>{
		if(this.state.is_liked){
			const dbRef = ref(db,`posts/${this.state.computer_id}/`);
			update(dbRef, {
				likes: increment(-1)
			})
		}else{						
			const dbRef = ref(db, `posts/${this.state.computer_id}/`);
			update(dbRef,{
				likes: increment(1)
			}); 
			this.setState({
				likes:(this.state.likes += 1), is_liked:true
			});
		}
	}
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

	async initiateTTS(title, computer, review) {
		console.log(title);
		const current_color = this.state.speakerColor;
		this.setState({
			speakerColor: current_color === 'gray' ? '#ee8249' : 'gray',
		});
		if (current_color === 'gray') {
			Speech.speak(title);
			Speech.speak(computer);
			Speech.speak('The review of the computer is!');
			Speech.speak(review);
		} else {
			Speech.stop();
		}
	}

	render() {
		if (!this.props.route.params) {
			this.props.navigation.navigate('Home');
		} else if (this.state.fontsLoaded) {		
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
								computertelling App
							</Text>
						</View>
					</View>
					<View style={styles.computerContainer}>
						<ScrollView
							style={
								this.state.light_theme ? styles.computerCardLight : styles.computerCard
							}>
							<Image
								source={require('../assets/computer_image_1.png')}
								style={styles.image}></Image>
							<View style={styles.dataContainer}>
								<View style={styles.titleTextContainer}>
									<Text
										style={
											this.state.light_theme
												? styles.computerTitleTextLight
												: styles.computerTitleText
										}>
										{this.props.route.params.computer.value.title}
									</Text>
									<Text
										style={
											this.state.light_theme
												? styles.computerReviewTextLight
												: styles.computerReviewText
										}>
										{this.props.route.params.computer.value.author}
									</Text>
									<Text
										style={
											this.state.light_theme
												? styles.computerReviewTextLight
												: styles.computerReviewText
										}>
										{this.props.route.params.computer.value.created_on}
									</Text>
								</View>
								<View style={styles.iconContainer}>
									<TouchableOpacity
										onPress={() =>
											this.initiateTTS(
												this.props.route.params.computer.value.title,
												this.props.route.params.computer.value.computer,
												this.props.route.params.computer.value.review
											)
										}>
										<Ionicons
											name={this.state.speakerIcon}
											size={RFValue(30)}
											color={this.state.speakerColor}
											style={{ margin: RFValue(15) }}		
										/>
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.computerTextContainer}>
								<Text
									style={
										this.state.light_theme ? styles.computerTextLight : styles.computerText
									}>
									{this.props.route.params.computer.value.computer}
								</Text>
								<Text
									style={
										this.state.light_theme ? styles.reviewTextLight : styles.reviewText
									}>
									Review - {this.props.route.params.computer.value.review}
								</Text>
							</View>
							<View style={styles.actionContainer}>
								<View style={styles.likeButton}>
									<Ionicons
										name={'heart'}
										size={RFValue(30)}
										color={this.state.light_theme ? 'black' : 'white'}
									/>
											<TouchableOpacity onPress = {()=>this.likeAction}>
												
											</TouchableOpacity>
									<Text
										style={
											this.state.light_theme ? styles.likeTextLight : styles.likeText
										}>
										0K
									</Text>
								</View>
							</View>
						</ScrollView>
					</View>
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
	computerContainer: {
		flex: 1,
	},
	computerCard: {
		margin: RFValue(20),
		backgroundColor: '#2f345d',
		borderRadius: RFValue(20),
	},
	computerCardLight: {
		margin: RFValue(20),
		backgroundColor: 'white',
		borderRadius: RFValue(20),
		shadowColor: 'rgb(0, 0, 0)',
		shadowOffset: {
			width: 3,
			height: 3,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 2,
	},
	image: {
		width: '100%',
		alignSelf: 'center',
		height: RFValue(200),
		borderTopLeftRadius: RFValue(20),
		borderTopRightRadius: RFValue(20),
		resizeMode: 'contain',
	},
	dataContainer: {
		flexDirection: 'row',
		padding: RFValue(20),
	},
	titleTextContainer: {
		flex: 0.8,
	},
	computerTitleText: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(25),
		color: 'white',
	},
	computerTitleTextLight: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(25),
		color: 'black',
	},
	computerReviewText: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(18),
		color: 'white',
	},
	computerReviewTextLight: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(18),
		color: 'black',
	},
	iconContainer: {
		flex: 0.2,
	},
	computerTextContainer: {
		padding: RFValue(20),
	},
	computerText: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(15),
		color: 'white',
	},
	computerTextLight: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(15),
		color: 'black',
	},
	reviewText: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(20),
		color: 'white',
	},
	reviewTextLight: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(20),
		color: 'black',
	},
	actionContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: RFValue(10),
	},
	likeButton: {
		width: RFValue(160),
		height: RFValue(40),
		flexDirection: 'row',
		backgroundColor: '#eb3948',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: RFValue(30),
	},
	likeText: {
		color: 'white',
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(25),
		marginLeft: RFValue(5),
	},
	likeTextLight: {
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(25),
		marginLeft: RFValue(5),
	},
});
