import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf')
};

const appIcon = require('../assets/logo.png');
export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            fontsLoaded: false,
            userSignedIn: false
        };
    }

    async _loadFontsAsync(){
        await Font.loadAsync(customFonts);
        this.state({fontsLoaded:true});
    }

    componentDidMount(){
        this._loadFontsAsync();
    }

    signIn = async(email,password)=>{
        const auth = getAuth();
        signInWithEmailAndPassword(auth,email,password)
        .then(()=>{
            this.props.navigation.replace("Dashboard");
        })
        .catch((error)=>{
            Alert.alert(error.message);
        });
    };  
    render(){
        if(this.state.fontsLoaded){
            SplashScreen.hideAsync();
            const {email,password} = this.state;
            return(
                <View style = {styles.container}>
                    <SafeAreaView style = {styles.droidSafeArea}/>
                    <Text style = {styles.appTitleText}> Computer Review</Text>
                    <Image source  = {appIcon} style = {styles.appIcon}/>
                    <Text
                     style ={styles.textInput}
                     onChangeText ={(text)=> this.setState({email: text})}
                     placeholder = {'Enter Password'}
                     placeholderTextColor = {"#FFFFFF"}
                     autoFocus
                     />
                    <TextInput
							style={[styles.textInput, { marginTop: 20 }]}
							onChangeText={(text) => this.setState({ password: text })}
							placeholder={'Enter Password'}
							placeholderTextColor={'#FFFFFF'}
							secureTextEntry
						/>
						<TouchableOpacity
							style={[styles.button, { marginTop: 20 }]}
							onPress={() => this.signIn(email, password)}>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('RegisterScreen')}>
							<Text style={styles.buttonTextNewUser}>New User ?</Text>
						</TouchableOpacity>
					</View>
				);
			}
		}
	}

    const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#15193c',
			alignItems: 'center',
			justifyContent: 'center',
		},
		droidSafeArea: {
			marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
		},
		appIcon: {
			width: RFValue(200),
			height: RFValue(200),
			resizeMode: 'contain',
			marginBottom: RFValue(20),
		},
		appTitleText: {
			color: 'white',
			textAlign: 'center',
			fontSize: RFValue(40),
			fontFamily: 'Bubblegum-Sans',
			marginBottom: RFValue(20),
		},
		textInput: {
			width: RFValue(250),
			height: RFValue(50),
			padding: RFValue(10),
			borderColor: '#FFFFFF',
			borderWidth: RFValue(4),
			borderRadius: RFValue(10),
			fontSize: RFValue(20),
			color: '#FFFFFF',
			backgroundColor: '#15193c',
			fontFamily: 'Bubblegum-Sans',
		},
		button: {
			width: RFValue(250),
			height: RFValue(50),
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			borderRadius: RFValue(30),
			backgroundColor: 'white',
			marginBottom: RFValue(20),	
		},
		buttonText: {
			fontSize: RFValue(24),
			color: '#15193c',
			fontFamily: 'Bubblegum-Sans',
		},
		buttonTextNewUser: {
			fontSize: RFValue(12),
			color: '#FFFFFF',
			fontFamily: 'Bubblegum-Sans',
			textDecorationLine: 'underline',
		},
	});
