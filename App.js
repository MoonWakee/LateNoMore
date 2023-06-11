import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import PlacePage from './components/PlacePage';
import CreatePage from './components/CreatePage';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Get Out" component={Home} />
        <Stack.Screen name="PlacePage" component={PlacePage} />
        <Stack.Screen name="CreatePage" component={CreatePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
