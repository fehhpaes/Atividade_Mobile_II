import { Platform } from 'react-native';

// Configuração da URL base da API
// DICA: No celular físico com Expo Go, use o IP da sua máquina na rede local (ex: 192.168.0.14)
// No emulador Android, você pode usar 10.0.2.2 ou o IP da rede local.
// Na web, localhost funciona diretamente.
const LOCAL_IP = '192.168.0.10';

export const API_URL = Platform.select({
  web: 'http://localhost:3000',
  android: `http://${LOCAL_IP}:3000`,
  ios: `http://${LOCAL_IP}:3000`,
  default: `http://${LOCAL_IP}:3000`,
});
