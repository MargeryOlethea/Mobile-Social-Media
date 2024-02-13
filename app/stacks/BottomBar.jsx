import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchPage from "../screens/SearchPage";
import CreatePage from "../screens/CreatePage";
import InboxPage from "../screens/InboxPage";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostStack from "./PostStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

function BottomBar() {
  return (
    <>
      <Tab.Navigator
        style={{ backgroundColor: "white" }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "white" },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Discover") {
              iconName = focused ? "compass" : "compass-outline";
            } else if (route.name === "Create") {
              iconName = focused ? "add-circle" : "add-circle-outline";
              size = 40;
            } else if (route.name === "Inbox") {
              iconName = focused
                ? "chatbox-ellipses"
                : "chatbox-ellipses-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={PostStack} />
        <Tab.Screen
          name="Discover"
          component={SearchPage}
          options={{ headerShown: true }}
        />
        <Tab.Screen
          name="Create"
          component={CreatePage}
          options={{ tabBarLabelStyle: { display: "none" } }}
        />
        <Tab.Screen name="Inbox" component={InboxPage} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </>
  );
}

export default BottomBar;
