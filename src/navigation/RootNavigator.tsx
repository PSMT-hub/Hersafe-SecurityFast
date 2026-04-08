import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import AppNavigator from './AppNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Param Lists para type-safety nas navegações
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Main: undefined; // tab navigator
};

// ─────────────────────────────────────────────────────────────────────────────
// Stacks
// ─────────────────────────────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login"    component={LoginScreen}    />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppRootNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Main" component={AppNavigator} />
    </AppStack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root: decide qual stack renderizar
// ─────────────────────────────────────────────────────────────────────────────

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AppRootNavigator /> : <AuthNavigator />;
}
