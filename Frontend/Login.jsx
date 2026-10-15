import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

const Login = ({ navigation }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const entrar = async () => {
    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    const resultado = await login(email, senha);
    if (resultado.sucesso) {
      alert(`Bem-vindo(a), ${resultado.usuario.nome}!`);
      // Navega para Home (a tela principal na Stack)
      navigation.navigate('Home');
    } else {
      alert(resultado.erro || 'Falha no login');
    }
  };

  return (
    <View style={styles.loginContainer}>
      {/* APPBAR */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Login"
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
        />
      </Appbar.Header>

      {/* FORMULÁRIO */}
      <View style={styles.loginContent}>
        <Text variant="headlineMedium" style={styles.loginTitulo}>
          Bem-vindo!
        </Text>

        <Text variant="bodyLarge" style={styles.loginTexto}>
          Entre com sua conta
        </Text>

        {/* E-MAIL */}
        <TextInput
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        {/* SENHA */}
        <TextInput
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? 'eye-off' : 'eye'}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            />
          }
          style={styles.input}
        />

        {/* ENTRAR */}
        <Button
          mode="contained"
          icon="login"
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          onPress={entrar}
        >
          ENTRAR
        </Button>

        {/* CADASTRO */}
        <Button
          mode="text"
          icon="account-plus"
          onPress={() => navigation.navigate('Cadastro')}
        >
          NÃO TENHO CADASTRO
        </Button>
      </View>
    </View>
  );
};

export default Login;