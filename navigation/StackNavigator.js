import React,{Component} from "react";
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ComputerScreen from '../screens/ComputerScreen';
const Stack = createStackNavigator();
const StackNavigator = ()=>{
    return(
        <Stack.Navigator    
        initialRouteName= "Home"
        screenOptions= {{
            headerShown: false,
        }}>
            <Stack.Screen name = "Home" component = {TabNavigator}/>
            <Stack.Screen name = "ComputerScreen" component ={ComputerScreen}/>
        </Stack.Navigator>
    );
};

export default StackNavigator;