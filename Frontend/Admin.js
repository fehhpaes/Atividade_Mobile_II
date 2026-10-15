import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Text,
  Card,
  Portal,
  Dialog,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';
import { API_URL } from './api';

const Admin = ({ navigation }) => {
  const { usuario, autenticado } = useAuth();

  // Estados do formulário de cadastro
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');

  // Estados de listagem e controle
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Estados do modal de edição
  const [dialogEdicao, setDialogEdicao] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editSubtitulo, setEditSubtitulo] = useState('');
  const [editImagem, setEditImagem] = useState('');

  useEffect(() => {
    carregarConteudos();
  }, []);

  const carregarConteudos = async () => {
    try {
      setCarregando(true);
      const res = await fetch(`${API_URL}/api/conteudos`);
      const data = await res.json();
      if (res.ok) {
        setConteudos(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar conteúdos:', err.message);
    } finally {
      setCarregando(false);
    }
  };

  // Escolher imagem da galeria
  const escolherImagemGaleria = async (isEdicao = false) => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('Permissão necessária para acessar fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      if (isEdicao) {
        setEditImagem(uri);
      } else {
        setImagem(uri);
      }
    }
  };

  // Cadastrar novo conteúdo
  const salvarNovoConteudo = async () => {
    if (!titulo.trim() || !imagem.trim()) {
      alert('Preencha pelo menos o título e a URL/foto da imagem.');
      return;
    }

    try {
      setSalvando(true);
      const res = await fetch(`${API_URL}/api/conteudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          subtitulo,
          descricao,
          imagem,
          usuarioId: usuario?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Conteúdo cadastrado com sucesso!');
        setTitulo('');
        setSubtitulo('');
        setDescricao('');
        setImagem('');
        carregarConteudos();
      } else {
        alert(data.erro || 'Falha ao cadastrar conteúdo.');
      }
    } catch (err) {
      alert('Erro de conexão ao salvar conteúdo.');
    } finally {
      setSalvando(false);
    }
  };

  // Abrir modal de edição
  const abrirEdicao = (item) => {
    setItemEditando(item);
    setEditTitulo(item.titulo);
    setEditSubtitulo(item.subtitulo || '');
    setEditImagem(item.imagem);
    setDialogEdicao(true);
  };

  // Salvar edição
  const confirmarEdicao = async () => {
    if (!itemEditando) return;

    try {
      setSalvando(true);
      const res = await fetch(`${API_URL}/api/conteudos/${itemEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editTitulo,
          subtitulo: editSubtitulo,
          imagem: editImagem,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Conteúdo e imagem atualizados com sucesso!');
        setDialogEdicao(false);
        carregarConteudos();
      } else {
        alert(data.erro || 'Erro ao atualizar.');
      }
    } catch (err) {
      alert('Erro de conexão ao editar conteúdo.');
    } finally {
      setSalvando(false);
    }
  };

  // Excluir conteúdo e imagem
  const excluirConteudo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/conteudos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Conteúdo e imagem excluídos com sucesso!');
        setConteudos((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert('Falha ao excluir o conteúdo.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir.');
    }
  };

  // Proteção de rota para usuário não autenticado (Requisito 2)
  if (!autenticado) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
          <Appbar.Content title="Área Administrativa" titleStyle={{ color: 'white' }} />
        </Appbar.Header>
        <View style={{ flex: 1, padding: 25, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 15 }}>
            Acesso Restrito
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 25, color: '#666' }}>
            Somente usuários autenticados podem acessar a área administrativa.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('Login')}>
            Fazer Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Área Administrativa" titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        {/* FORMULÁRIO DE CADASTRO DE CONTEÚDO */}
        <Card style={{ padding: 15, marginBottom: 20, backgroundColor: '#FFFFFF' }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Cadastrar Novo Conteúdo
          </Text>

          <TextInput
            label="Título *"
            placeholder="Ex: Breaking Bad"
            value={titulo}
            onChangeText={setTitulo}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />

          <TextInput
            label="Subtítulo / Episódio"
            placeholder="Ex: 1x01 - Pilot"
            value={subtitulo}
            onChangeText={setSubtitulo}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />

          <TextInput
            label="URL da Imagem *"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imagem}
            onChangeText={setImagem}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />

          <Button
            mode="outlined"
            icon="image"
            onPress={() => escolherImagemGaleria(false)}
            style={{ marginBottom: 10 }}
          >
            Escolher da Galeria
          </Button>

          <TextInput
            label="Descrição"
            placeholder="Breve sinopse do conteúdo"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={{ marginBottom: 15 }}
          />

          <Button
            mode="contained"
            icon="plus"
            loading={salvando}
            onPress={salvarNovoConteudo}
          >
            Cadastrar Conteúdo
          </Button>
        </Card>

        {/* LISTA DE CONTEÚDOS COM OPÇÕES DE EDITAR E EXCLUIR IMAGEM */}
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
          Conteúdos Cadastrados ({conteudos.length})
        </Text>

        {carregando ? (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        ) : (
          conteudos.map((item) => (
            <Card key={item._id} style={{ marginBottom: 15, backgroundColor: '#FFFFFF' }}>
              <Card.Title title={item.titulo} subtitle={item.subtitulo} />
              <Card.Cover source={{ uri: item.imagem }} style={{ height: 180 }} />
              <Card.Actions style={{ justifyContent: 'space-between' }}>
                <Text variant="bodySmall" style={{ color: '#777', flex: 1 }} numberOfLines={1}>
                  {item.descricao || 'Sem descrição'}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#eda73e"
                    size={22}
                    onPress={() => abrirEdicao(item)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#B00020"
                    size={22}
                    onPress={() => excluirConteudo(item._id)}
                  />
                </View>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* MODAL DE EDIÇÃO DE CONTEÚDO E IMAGEM */}
      <Portal>
        <Dialog visible={dialogEdicao} onDismiss={() => setDialogEdicao(false)}>
          <Dialog.Title>Editar Conteúdo / Imagem</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Título"
              value={editTitulo}
              onChangeText={setEditTitulo}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Subtítulo"
              value={editSubtitulo}
              onChangeText={setEditSubtitulo}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="URL da Imagem"
              value={editImagem}
              onChangeText={setEditImagem}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="outlined"
              icon="image"
              onPress={() => escolherImagemGaleria(true)}
              style={{ marginTop: 5 }}
            >
              Trocar Foto da Galeria
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogEdicao(false)}>Cancelar</Button>
            <Button loading={salvando} onPress={confirmarEdicao}>
              Salvar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Admin;
