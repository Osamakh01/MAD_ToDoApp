import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TaskAddScreen from './src/screens/TaskAddScreen'
import TaskListScreen from './src/screens/TaskListScreen'


export default function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Task List"
            >
                <Stack.Screen name="Task Lists" component={TaskListScreen} />
                <Stack.Screen name="Add Task" component={TaskAddScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}