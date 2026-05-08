import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import AppNavigator from './AppNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TipsScreen from '../screens/TipsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Param Lists para type-safety nas navegações
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Main: undefined; // tab navigator
  Tips: undefined;
  Notifications: undefined;
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
      <AppStack.Screen name="Tips" component={TipsScreen} options={{ headerShown: true, title: 'Dicas e Ajuda', headerBackTitle: '', headerTintColor: '#F0EFFE', headerStyle: { backgroundColor: '#1C1C27' } }} />
      <AppStack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: 'Notificações', headerBackTitle: '', headerTintColor: '#F0EFFE', headerStyle: { backgroundColor: '#1C1C27' } }} />
    </AppStack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root: decide qual stack renderizar
// ─────────────────────────────────────────────────────────────────────────────

export default function RootNavigator() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  // Aguarda validação do token salvo antes de decidir qual stack exibir
  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121218' }}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  return isAuthenticated ? <AppRootNavigator /> : <AuthNavigator />;
}
