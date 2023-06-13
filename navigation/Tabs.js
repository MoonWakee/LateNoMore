import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/Home";
import Alarms from "../components/Alarms";
import PlacePage from "../components/PlacePage";
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
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const customHeaderBackButton = ({ onPress }) => {
    const { setIsModified } = useContext(AppContext);

    const handlePress = () => {
        setIsModified(true);
        onPress();
    };
    return (
        <TouchableOpacity onPress={handlePress} style={{ marginLeft: 24 }}>
            <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
    );
};

const customCreateButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            flex: 1,
            top: -30,
            justifyContent: "center",
            alignItems: "center",
            ...styles.shadow,
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: "#e32f45",
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

function HomeStack() {
    const { isOpen } = useContext(AppContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                headerStyle: {
                    backgroundColor: isOpen ? "rgba(0, 0, 0, 0.5)" : "white",
                },
                headerLeft: customHeaderBackButton,
            }}
        >
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerLeft: false, headerTitle: "Get Out" }}
            />
            <Stack.Screen name="PlacePage" component={PlacePage} />
        </Stack.Navigator>
    );
}

export default function Tabs() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModified, setIsModified] = useState(true);
    return (
        <AppContext.Provider
            value={{ isOpen, setIsOpen, isModified, setIsModified }}
        >
            <SafeAreaView
                style={{
                    flex: 0,
                    backgroundColor: isOpen ? "rgba(0, 0, 0, 0.5)" : "white",
                }}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarShowLabel: false,
                            tabBarIcon: () => null,
                            tabBarStyle: {
                                position: "absolute",
                                bottom: 0,
                                marginLeft: 10,
                                marginRight: 10,
                                elevation: 0,
                                borderRadius: 15,
                                height: 90,
                                ...(!isOpen && styles.shadow),
                            },
                        }}
                    >
                        <Tab.Screen
                            name="Main"
                            component={HomeStack}
                            listeners={() => ({
                                tabPress: (e) => {
                                    setIsModified(true);
                                },
                            })}
                            options={{
                                headerShown: false,
                                tabBarIcon: ({ focused }) => (
                                    <View style={styles.iconStyle}>
                                        <Icon
                                            name="home"
                                            type="ionicon"
                                            size={35}
                                            color={
                                                focused ? "#e32f45" : "#748c94"
                                            }
                                        />
                                        <Text
                                            style={{
                                                color: focused
                                                    ? "#e32f45"
                                                    : "#748c94",
                                            }}
                                        >
                                            Home
                                        </Text>
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
                                            width: 58,
                                            height: 58,
                                            tintColor: "white",
                                        }}
                                    />
                                ),
                                tabBarButton: (props) =>
                                    customCreateButton(props),
                            }}
                        />
                        <Tab.Screen
                            name="Alarms"
                            component={Alarms}
                            options={{
                                headerLeft: false,
                                headerTitle: "Alarm Page",
                                headerStyle: {
                                    backgroundColor: isOpen
                                        ? "rgba(0, 0, 0, 0.5)"
                                        : "white",
                                },
                                tabBarBadgeStyle: {
                                    top: 8,
                                },
                                tabBarBadge: 3,
                                tabBarIcon: ({ focused }) => (
                                    <View style={styles.iconStyle}>
                                        <Icon
                                            name="notifications-circle-outline"
                                            type="ionicon"
                                            size={40}
                                            color={
                                                focused ? "#e32f45" : "#748c94"
                                            }
                                        />
                                        <Text
                                            style={{
                                                color: focused
                                                    ? "#e32f45"
                                                    : "#748c94",
                                            }}
                                        >
                                            Alarms
                                        </Text>
                                    </View>
                                ),
                            }}
                        />
                    </Tab.Navigator>
                    {/* Create Modal Starts here! */}

                    {isOpen && <CreateModal />}
                </View>
            </SafeAreaView>
        </AppContext.Provider>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    iconStyle: {
        alignItems: "center",
        justifyContent: "center",
        top: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
