import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';
import { View } from 'react-native';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';
import { AuthProvider } from './AuthContext';

// Telas
import AppBar from './AppBar';
import Pesquisa from './Pesquisa';
import Acesso from './Acesso';
import Login from './Login';
import Cadastro from './Cadastro';
import { Perfil } from './Perfil';
import Admin from './Admin';
import { CabecalhoMenu } from './CabecaMenu';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={AppBar} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Acesso" component={Acesso} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Admin" component={Admin} />
    </Stack.Navigator>
  );
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1 }}>
          <CabecalhoMenu />
          <DrawerContentScrollView {...props} />
        </View>
      )}
    >
      <Drawer.Screen name="Início" component={StackNavigator} />
      <Drawer.Screen name="Séries" component={AppBar} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reduzido para 1.5s para transição suave sem travamento longo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <DrawerNavigation />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
