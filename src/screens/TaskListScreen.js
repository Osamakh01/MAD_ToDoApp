import React, {
    useState,
    useEffect
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TaskListScreen(props) {

    const [tasks, setTasks] = useState([
        // {id: 0, activity: "Wake up", completed: false},
        // {id: 1, activity: "Pray", completed: false},
        // {id: 2, activity: "Excercise", completed: false},
        // {id: 3, activity: "Breakfast", completed: false},
        // {id: 4, activity: "Assignment", completed: false},
    ]);

    useEffect(() => {
        getTasksFromLS();
    }, []);

    const getTasksFromLS = async _ => {
        try {
            const jsonValue = await AsyncStorage.getItem('tasks');
            console.log('Array: ', jsonValue);
            jsonValue != null ? setTasks(JSON.parse(jsonValue)) : null
        } catch (e) {
            // read error
        }
    }

    const pushTask = async (title, taskDiscription) => {
        const allTasks = tasks;
        setTasks([...allTasks, {
            id: tasks.length,
            title,
            activity: taskDiscription,
            completed: false
        }]);

        try {
            const jsonValue = JSON.stringify([...allTasks, {
                id: tasks.length,
                title,
                activity: taskDiscription,
                completed: false
            }])
            await AsyncStorage.setItem('tasks', jsonValue)
        } catch (e) {
            // save error
            console.error(e);
        }
        console.log('Done.')
    }

    const deleteTask = async id => {
        const updatedTasksList = tasks.filter(task => task.id !== id);
        setTasks([...updatedTasksList]);
        try {
            const jsonValue = JSON.stringify(updatedTasksList)
            await AsyncStorage.setItem('tasks', jsonValue)
        } catch (e) {
            // save error
            console.error(e);
        }
        console.log('Done.')
    }

    const [searchText, setSearchText] = useState('');

    return (
        <View style={styles.contianer}>
            <View style={{
                marginVertical: 20,
                backgroundColor: '#C8C8C8',
                height: 50,
                justifyContent: 'center',
                borderRadius: 20,
                paddingLeft: 20
            }}>
                <TextInput
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    placeholder='Search'
                    placeholderTextColor='black'
                />
            </View>
            <View>
                {
                    searchText.length > 0 ? tasks.filter(singleTaks => {
                        return singleTaks.title === searchText
                    }).map((item, index) => {
                        return (
                            <View style={styles.taskItemContainer}>
                                <View style={{
                                    flexDirection: 'row',
                                    borderWidth: 3,
                                    borderColor: 'red'
                                }}>
                                    <View>
                                        <Text style={styles.itemTitleStyle}>{item.title}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.taskDiscriptionStyle}>{item.activity}</Text>
                                    </View>
                                </View>
                                <View
                                    style={styles.secondaryContainer}
                                >
                                    <View>
                                        <CheckBox
                                            disabled={false}
                                            value={item.completed}
                                            onValueChange={newValue => {
                                                const allTasks = tasks;
                                                allTasks[index].completed = newValue
                                                setTasks([...allTasks]);
                                            }}
                                            tintColor="black"
                                            onTintColor="white"
                                            onCheckColor="white"
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={styles.binView}
                                        onPress={_ => {
                                            deleteTask(item.id)
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/delete_icon.png')}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                tintColor: 'grey'
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }) :
                        tasks.length > 0 ? <FlatList
                            data={tasks}
                            renderItem={({ item, index }) => {
                                return (

                                    <View style={styles.taskItemContainer}>
                                        <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <View>
                                        <Text style={styles.itemTitleStyle}>{item.title}: </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.taskDiscriptionStyle}>{item.activity}</Text>
                                    </View>
                                </View>
                                        <View
                                            style={styles.secondaryContainer}
                                        >
                                            <View>
                                                <CheckBox
                                                    disabled={false}
                                                    value={item.completed}
                                                    onValueChange={newValue => {
                                                        const allTasks = tasks;
                                                        allTasks[index].completed = newValue
                                                        setTasks([...allTasks]);
                                                    }}
                                                    tintColor="black"
                                                    onTintColor="white"
                                                    onCheckColor="white"
                                                />
                                            </View>
                                            <TouchableOpacity
                                                style={styles.binView}
                                                onPress={_ => {
                                                    deleteTask(item.id)
                                                }}
                                            >
                                                <Image
                                                    source={require('../../assets/delete_icon.png')}
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        tintColor: 'grey'
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                        /> : <View style={styles.noTaskTextContainer}>
                            <Text style={styles.noTaskTextStyle}>Tap add icon to add task</Text>
                        </View>
                }
            </View>
            <View style={styles.addIconContainer}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={_ => props.navigation.navigate('Add Task', {
                        addTasksCallback: (title, taskDesc) => {
                            pushTask(title, taskDesc)
                        }
                    })}
                >
                    <Image
                        source={require('../../assets/add_icon.png')}
                        style={styles.addIconStyle}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "black"
    },
    headingTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    taskItemContainer: {
        paddingHorizontal: 20,
        borderRadius: 20,
        marginVertical: 10,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    taskDiscriptionStyle: {
        fontSize: 20
    },
    addIconContainer: {
        // position: 'absolute',
        // bottom: 20,
        // right: 10
        paddingHorizontal: 20
    },
    headingTextStyle: {
        fontSize: 30,
    },
    buttonStyle: {
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
    },
    taskItemParentContainer: {
        flexDirection: 'row',
        width: '80%'
    },
    binImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    noTaskTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    noTaskTextStyle: {
        fontSize: 30,
        color: 'white'
    },
    addIconStyle: {
        width: 20,
        height: 20
    },
    secondaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    binView: {
        marginLeft: 20
    },
    itemTitleStyle: {
        fontSize: 30
    }
});