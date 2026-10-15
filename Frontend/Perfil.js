import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './AuthContext';

const Perfil = ({ navigation }) => {
  const { usuario, autenticado, atualizarPerfil } = useAuth();

  // Dados do usuário
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [telefone, setTelefone] = useState(usuario?.telefone || '(15) 99999-9999');
  const [cpf, setCpf] = useState(usuario?.cpf || '');
  const [senha, setSenha] = useState('');
  const [imagem, setImagem] = useState(usuario?.imagem || null);
  const [salvando, setSalvando] = useState(false);

  // Formatação e máscara automática de CPF (máximo 11 dígitos numéricos)
  const formatarCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setCpf(usuario.cpf || '');
      setImagem(usuario.imagem || null);
    }
  }, [usuario]);

  // ESCOLHER IMAGEM DA GALERIA
  const editarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  // SALVAR PERFIL NO BACKEND
  const salvarPerfil = async () => {
    if (!autenticado) {
      alert('Faça login primeiro para atualizar seus dados no servidor.');
      return;
    }

    try {
      setSalvando(true);
      const resultado = await atualizarPerfil({
        nome,
        telefone,
        cpf,
        imagem,
        senha: senha ? senha : undefined,
      });

      if (resultado.sucesso) {
        alert('Perfil atualizado com sucesso no banco de dados!');
        setSenha('');
      } else {
        alert(resultado.erro || 'Falha ao salvar dados.');
      }
    } catch (err) {
      alert('Erro de conexão ao salvar alterações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.avatarImagem} />
          ) : (
            <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          )}

          {/* BOTÃO EDITAR FOTO */}
          <IconButton
            icon="pencil"
            iconColor="white"
            size={18}
            style={styles.botaoEditar}
            onPress={editarFoto}
          />
        </View>

        {/* TÍTULO */}
        <Text variant="headlineSmall" style={styles.titulo}>
          Meu Perfil
        </Text>

        <Text style={styles.subtitulo}>
          Atualize seus dados pessoais
        </Text>
      </View>

      <Divider />

      {/* FORMULÁRIO */}
      <View style={styles.formulario}>
        {/* NOME */}
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={styles.input}
        />

        {/* E-MAIL (Desabilitado pois é chave de login) */}
        <TextInput
          label="E-mail"
          value={email}
          editable={false}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        {/* TELEFONE */}
        <TextInput
          label="Telefone"
          placeholder="(15) 99999-9999"
          value={telefone}
          onChangeText={setTelefone}
          mode="outlined"
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
          style={styles.input}
        />

        {/* CPF */}
        <TextInput
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={(texto) => setCpf(formatarCPF(texto))}
          mode="outlined"
          keyboardType="numeric"
          maxLength={14}
          left={<TextInput.Icon icon="card-account-details" />}
          style={styles.input}
        />

        {/* NOVA SENHA */}
        <TextInput
          label="Nova senha (deixe em branco se não quiser alterar)"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
          style={styles.input}
        />

        {/* SALVAR */}
        <Button
          mode="contained"
          icon="content-save"
          loading={salvando}
          disabled={salvando}
          onPress={salvarPerfil}
          style={styles.botao}
        >
          Salvar alterações
        </Button>

        {/* VOLTAR */}
        <Button
          mode="outlined"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.botaoVoltar}
        >
          Voltar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cabecalho: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#C0C0C0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#F2A900',
  },
  avatarImagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  botaoEditar: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#555555',
    margin: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  titulo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#FFFFFF',
    marginTop: 5,
  },
  formulario: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  botao: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#eda73e',
  },
  botaoVoltar: {
    marginTop: 15,
    paddingVertical: 5,
  },
});

export { Perfil };
