import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/Home";
import Alarms from "../components/AlarmComponents/Alarms";
import PlacePage from "../components/PlaceComponents/PlacePage";
import DummyPage from "../components/DummyPage";
import CreateModal from "../components/CreateModal";
import AppContext from "./AppContext";

import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useState, useContext, useRef, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { getAlarmItems, getPlaceItems, getTimerItems, getAlarmItemsOn } from "../Crud";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const customHeaderBackButton = ({ onPress }) => {
    const { setIsModified, setAlarmItems } = useContext(AppContext);

    const handlePress = async () => { 
        let alarm_length = await getAlarmItemsOn();
        setAlarmItems(alarm_length);
        setIsModified(true);
        onPress();
    };
    return (
        <TouchableOpacity onPress={handlePress} style={{ marginLeft: 24 }}>
            <Icon type='ionicon' name="arrow-back-circle" size={35} color='white'/>
        </TouchableOpacity>
    );
};

const customCreateButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            flex: 1,
            top: 10,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 75,
                height: 75,
                borderRadius: 40,
                backgroundColor: "white",
                ...styles.shadow,
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

function HomeStack() {
    const { isOpen, setIsModified, setIsOpen, alarmItems, setAlarmItems } = useContext(AppContext);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarIcon: () => null,
                tabBarStyle: {
                    headerShown: false,
                    position: "absolute",
                    bottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    elevation: 0,
                    borderRadius: 30,
                    height: 95,
                    ...(!isOpen && styles.shadow),
                    backgroundColor: "#a8bbd6",
                },
            }}
        >
            <Tab.Screen
                name="Main"
                component={Home}
                listeners={() => ({
                    tabPress: (e) => {
                        setIsModified(true);
                    },
                })}
                options={{
                    headerTitle: "Get Out",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: 700,
                    },
                    headerStyle: {
                        backgroundColor: "#a8bbd6",
                    },
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.iconStyle,
                                // {
                                //     backgroundColor: focused
                                //         ? "white"
                                //         : "#a8bbd6",
                                // },
                            ]}
                        >
                            <Icon
                                name="home"
                                type="ionicon"
                                size={30}
                                color={focused ? "white" : "#e6e6e6"}
                            />
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: focused ? "white" : "#e6e6e6",
                                }}
                            >
                                Home
                            </Text>
                            {focused && (
                                <View
                                    style={[
                                        styles.bottomLine,
                                        {
                                            borderBottomColor: "#cd5554",
                                        },
                                    ]}
                                />
                            )}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="DummyPage"
                component={DummyPage}
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require("../resources/CreateButton.png")}
                            resizeMode="contain"
                            style={{
                                width: 70,
                                height: 70,
                                tintColor: "#cd5554",
                            }}
                        />
                    ),
                    tabBarButton: (props) => customCreateButton(props),
                }}
            />
            <Tab.Screen
                name="Alarms"
                listeners={() => ({
                    tabPress: (e) => {
                        setIsModified(true);
                    },
                })}
                component={Alarms}
                options={{
                    headerTitle: "Alarms",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontWeight: 700,
                    },
                    headerStyle: {
                        backgroundColor: "#a8bbd6",
                    },
                    tabBarBadgeStyle: {
                        top: 8,
                    },
                    tabBarBadge: alarmItems === 0 ? null : alarmItems,
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.iconStyle,
                                // {
                                //     backgroundColor: focused
                                //         ? "white"
                                //         : "#a8bbd6",
                                // },
                            ]}
                        >
                            <Icon
                                name="notifications"
                                type="ionicon"
                                size={30}
                                color={focused ? "white" : "#e6e6e6"}
                            />
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: focused ? "white" : "#e6e6e6",
                                }}
                            >
                                Alarms
                            </Text>
                            {focused && (
                                <View
                                    style={[
                                        styles.bottomLine,
                                        {
                                            borderBottomColor: "#cd5554",
                                        },
                                    ]}
                                />
                            )}
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function Tabs() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModified, setIsModified] = useState(true);
    const [alarmItems, setAlarmItems] = useState(0);

    useEffect(() => {
        const get_alarm = async() => {
            const alarm_length = await getAlarmItemsOn();
            setAlarmItems(alarm_length);
        }
        get_alarm();
    }, [])

    return (
        <AppContext.Provider
            value={{ isOpen, setIsOpen, isModified, setIsModified, alarmItems, setAlarmItems }}
        >
            <SafeAreaView
                style={{
                    flex: 0,
                    backgroundColor: isOpen ? "#545d6b" : "#a8bbd6",
                }}
            />
            {/* <SafeAreaView style={styles.container}> */}
            <View style={styles.container}>
                <Stack.Navigator
                    screenOptions={{
                        headerBackTitleVisible: false,
                        animation: "slide_from_right",
                        headerStyle: {
                            backgroundColor: "#a8bbd6",
                        },
                        headerLeft: customHeaderBackButton,
                        
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeStack}
                        options={{
                            headerLeft: false,
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="PlacePage" component={PlacePage} options={{headerBackTitleStyle: false, headerTitle: ''}}/>
                </Stack.Navigator>

                {/* Create Modal Starts here! */}

                {isOpen && <CreateModal />}
            </View>
            {/* </SafeAreaView> */}
        </AppContext.Provider>
    );
}

const styles = StyleSheet.create({
    shadowButton: {
        shadowColor: "gray",
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 10,
    },

    shadow: {
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 5,
    },
    iconStyle: {
        alignItems: "center",
        justifyContent: "center",
        top: 10,
        padding: 8,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    container: {
        flex: 1,
    },
    bottomLine: {
        borderBottomWidth: 4,
        width: 30,
        marginTop: 3,
        borderRadius: 100,
    },
});
