import { View, Text, Image,  StyleSheet, ActivityIndicator  } from 'react-native';

import {styles}  from './css/Styles';
const SplashScreen = () => {
    return (
        <View style={styles.container}>

            <Image
                source={require('./assets/logo.jpg')}
                style={styles.logo}
            />
            <ActivityIndicator size="large" color="blue" />
            <Text style={{}}>
                Carregando...
            </Text>
        </View>
    )
}

export default SplashScreen;