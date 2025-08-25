import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import CategoryInsightsScreen from "./src/screens/CategoryInsightsScreen";
import MonthlySummaryScreen from "./src/screens/MonthlySummaryScreen";
import EditTransactionScreen from "./src/screens/EditTransactionScreen";
import TransactionScreen from "./src/screens/TransactionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="CategoryInsights"
          component={CategoryInsightsScreen}
        />
        <Stack.Screen name="MonthlySummary" component={MonthlySummaryScreen} />
        <Stack.Screen
          name="TransactionScreen"
          component={TransactionScreen}
          options={{ title: "Add Transaction" }}
        />
        <Stack.Screen
          name="EditTransactionScreen"
          component={EditTransactionScreen}
          options={{ title: "Edit Transaction" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
