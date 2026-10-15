import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

const Cadastro = ({ navigation }) => {
  const { cadastro, loading } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const cadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas digitadas não coincidem.');
      return;
    }

    const resultado = await cadastro({
      nome,
      email,
      senha,
    });

    if (resultado.sucesso) {
      alert('Cadastro realizado com sucesso!');
      navigation.navigate('Home');
    } else {
      alert(resultado.erro || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <View style={styles.cadastroContainer}>
      {/* APPBAR */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Cadastro"
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* FORMULÁRIO */}
        <View style={styles.cadastroContent}>
          <Text variant="headlineMedium" style={styles.cadastroTitulo}>
            Criar conta
          </Text>

          <Text variant="bodyLarge" style={styles.cadastroTexto}>
            Preencha os dados abaixo
          </Text>

          {/* NOME */}
          <TextInput
            label="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />

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

          {/* CONFIRMAR SENHA */}
          <TextInput
            label="Confirmar senha"
            placeholder="Digite novamente sua senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            mode="outlined"
            secureTextEntry={!mostrarConfirmacao}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={mostrarConfirmacao ? 'eye-off' : 'eye'}
                onPress={() => setMostrarConfirmacao(!mostrarConfirmacao)}
              />
            }
            style={styles.input}
          />

          {/* CADASTRAR */}
          <Button
            mode="contained"
            icon="account-plus"
            loading={loading}
            disabled={loading}
            style={styles.cadastroButton}
            onPress={cadastrar}
          >
            CADASTRAR
          </Button>

          {/* JÁ POSSUI CONTA */}
          <Button
            mode="text"
            icon="login"
            onPress={() => navigation.navigate('Login')}
          >
            JÁ TENHO CADASTRO
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Cadastro;