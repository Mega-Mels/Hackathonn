import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ReportScreen from "./src/screens/ReportScreen";
import RedZoneSetupScreen from "./src/screens/RedZoneSetUpScreen";
import CommunityUpdatesScreen from "./src/screens/CommunityUpdatesScreen";
import TravelBuddiesScreen from "./src/screens/TravelBuddiesScreen";
import PastReportsScreen from "./src/screens/PastReportsScreen";
import ProfileManagementScreen from "./src/screens/ProfileManagementScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ onClose }: { onClose: () => void }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Report">
        <Stack.Screen
          name="Report"
          options={{ headerShown: false }}
        >
          {(props) => <ReportScreen {...props} onClose={onClose} />}
        </Stack.Screen>

        <Stack.Screen
          name="RedZoneSetup"
          component={RedZoneSetupScreen}
          options={{ title: "Red Zone Setup" }}
        />
        
        <Stack.Screen
          name="CommunityUpdates"
          component={CommunityUpdatesScreen}
          options={{ title: "Community Updates" }}
        />
        
        <Stack.Screen
          name="TravelBuddies"
          component={TravelBuddiesScreen}
          options={{ title: "Travel Buddies" }}
        />
        
        <Stack.Screen
          name="PastReports"
          component={PastReportsScreen}
          options={{ title: "Past Reports" }}
        />
        
        <Stack.Screen
          name="ProfileManagement"
          component={ProfileManagementScreen}
          options={{ title: "Profile Management" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;