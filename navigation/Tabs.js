import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/Home";
import Alarms from "../components/Alarms";
import PlacePage from "../components/PlacePage";
import CreatePage from "../components/CreatePage";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "@rneui/base";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const customHeaderBackButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 24 }}>
        <Icon name="arrow-back" size={24} />
    </TouchableOpacity>
);

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                headerStyle: {
                    backgroundColor: "#ffffff",
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
            {/* <Stack.Screen name="CreatePage" component={CreatePage} /> */}
        </Stack.Navigator>
    );
}

export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarIcon: () => null,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 25,
                    marginLeft: 10,
                    marginRight: 10,
                    elevation: 0,
                    backgroundColor: "white",
                    borderRadius: 15,
                    height: 90,
                    ...styles.shadow,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ headerShown: false,
                tabBarIcon: ({focused}) => (
                    <View>
                        <Image />
                        <Text> Home</Text>
                    </View>
                    )
                }}/>
            <Tab.Screen name="CreatePages" component={CreatePage} options={{  headerLeft: false, headerTitle: "Create Page",
                tabBarIcon: ({focused}) => (
                    <View>
                        <Image />
                        <Text> Create</Text>
                    </View>
                    )
                }}/>
            <Tab.Screen name="Alarms" component={Alarms} options={{  headerLeft: false, headerTitle: "Alarm Page",
                tabBarIcon: ({focused}) => (
                    <View>
                        <Image />
                        <Text> Alarms</Text>
                    </View>
                    )
                }}/>
        </Tab.Navigator>
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
});
