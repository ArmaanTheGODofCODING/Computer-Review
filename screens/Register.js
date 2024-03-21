import React,{Component} from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform,
    StatusBar,
    Text,
    Image
} from 'react-native';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {ref,set} from 'firebase/database';
import db from '../config';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
let customFonts = {
    'Bubblegum-Sans' : require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

const appIcon = require('../assets/logo.png');

export default class RegisterScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            first_name : '',
            last_name : '',
            email :'',
            password : '',
            confirmPassword :'',
            fontsLoaded:  false
        };
    }
    async _loadFontsAsync(){
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true});
    }

    componentDidMount(){
        this._loadFontsAsync();
    }
    registerUser = (email,password,confirmPassword,first_name,last_name)=>{
        if (password = confirmPassword){
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) =>{
                Alert.alert('User registered!');
                console.log(userCredential.user.uid);
                this.props.navigation.replace('Login');
                const dbRef = ref(db, '/users/'+ userCredential.user.uid);
                set(dbRef,{
                    email: userCredential.user.email,
                    first_name: first_name,
                    last_name:last_name,
                    current_theme : 'dark'
                });
            })
            .catch((error) =>{
                Alert.alert(error.message);
            });
        }else{
            Alert.alert("Passwords do not match! ");
        }
    };

    render(){
        if(this.state.fontsLoaded){
            SplashScreen.hideAsync();
            const {email,password,confirmPassword, first_name, last_name} = this.state;

            return(
                <View style = {styles.container}>
                    <SafeAreaView style = {styles.droidSafeArea}/>
                    <Text style  = {styles.appTitleText}>Register</Text>
                    <Text 
                    style = {styles.textInput}
                    onChangeStyle = {(text)=>this.setState({first_name: text})}
                    placeholder = {'First Name'}
                    placeholderTextColor ={"#FFFFFF"}
                    />
                    <Text 
                    style = {styles.textInput}
                    onChangeStyle = {(text)=>this.setState({last_name: text})}
                    placeholder = {'Last Name'}
                    placeholderTextColor ={"#FFFFFF"}
                    />
                    <Text 
                    style = {styles.textInput}
                    onChangeStyle = {(text)=>this.setState({email: text})}
                    placeholder = {'Enter Email ID'}
                    placeholderTextColor ={"#FFFFFF"}
                    secureTextEntry 
                    />
                    <Text 
                    style = {styles.textInput}
                    onChangeStyle = {(text)=>this.setState({password: text})}
                    placeholder = {'Make a password!'}
                    placeholderTextColor ={"#FFFFFF"}
                    />

                     <TextInput
						style={styles.textinput}
						onChangeText={(text) => this.setState({ confirmPassword: text })}
						placeholder={'Re-enter Password'}
						placeholderTextColor={'#FFFFFF'}
						secureTextEntry
					/>
                    <TouchableOpacity
                    style = {[styles.button,{marginTop:20}]}
                    onPress={()=>{
                        this.registerUser(
                            email,
                            password,
                            confirmPassword,
                            first_name,
                            last_name
                        )
                    }}>
                        <Text style = {styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.navigation.replace("Login")}>
                        <Text style=  {styles.buttonTextNewUser}> Login? </Text>
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
		height: RFValue(40),
		padding: RFValue(10),
		marginTop: RFValue(10),
		borderColor: '#FFFFFF',
		borderWidth: RFValue(4),
		borderRadius: RFValue(10),
		fontSize: RFValue(15),
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

