import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import {
  Appbar,
  ActivityIndicator,
  Portal,
  Dialog,
  TextInput,
  Button,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { API_URL } from './api';
import { useAuth } from './AuthContext';

const AppBar = ({ navigation }) => {
  const { autenticado } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Estados para edição rápida de imagem
  const [dialogEdicao, setDialogEdicao] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [novaImagemUrl, setNovaImagemUrl] = useState('');

  const carregarConteudos = async () => {
    try {
      setCarregando(true);
      const res = await fetch(`${API_URL}/api/conteudos`);
      const data = await res.json();
      if (res.ok) {
        setConteudos(data);
      }
    } catch (err) {
      console.warn('Erro ao buscar conteúdos:', err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarConteudos();
  }, []);

  const abrirEdicaoImagem = (item) => {
    setItemEditando(item);
    setNovaImagemUrl(item.imagem);
    setDialogEdicao(true);
  };

  const escolherFotoGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('Permissão necessária para acessar fotos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!res.canceled) {
      setNovaImagemUrl(res.assets[0].uri);
    }
  };

  const salvarNovaImagem = async () => {
    if (!itemEditando || !novaImagemUrl.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/conteudos/${itemEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagem: novaImagemUrl }),
      });

      if (res.ok) {
        alert('Imagem atualizada com sucesso!');
        setDialogEdicao(false);
        carregarConteudos();
      } else {
        alert('Falha ao atualizar a imagem.');
      }
    } catch (err) {
      alert('Erro de conexão ao salvar imagem.');
    }
  };

  const excluirConteudo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/conteudos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Imagem e conteúdo excluídos com sucesso!');
        setConteudos((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert('Erro ao excluir conteúdo.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir.');
    }
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon="menu"
          iconColor="white"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Technologic" titleStyle={{ color: 'white' }} />
        <Appbar.Action
          icon="magnify"
          iconColor="white"
          onPress={() => navigation.navigate('Pesquisa')}
        />
        <Appbar.Action
          icon="account"
          iconColor="white"
          onPress={() => navigation.navigate(autenticado ? 'Perfil' : 'Acesso')}
        />
      </Appbar.Header>

      {/* ABAS DE CATEGORIAS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        <View style={styles.tab}>
          <Text style={styles.tabText}>TODOS</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>SÉRIES</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>FILMES</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>DOCUMENTÁRIOS</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>LANÇAMENTOS</Text>
        </View>
      </ScrollView>

      {/* LISTA DE CARDS DINÂMICOS */}
      <ScrollView
        style={styles.cards}
        contentContainerStyle={styles.cardsContent}
        refreshControl={
          <RefreshControl refreshing={carregando} onRefresh={carregarConteudos} />
        }
      >
        {carregando && conteudos.length === 0 ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : conteudos.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text>Nenhum conteúdo encontrado.</Text>
            {autenticado && (
              <Button
                mode="contained"
                style={{ marginTop: 15 }}
                onPress={() => navigation.navigate('Admin')}
              >
                Cadastrar Primeiro Conteúdo
              </Button>
            )}
          </View>
        ) : (
          conteudos.map((item) => (
            <ModCard
              key={item._id}
              conteudo={item}
              onEditar={abrirEdicaoImagem}
              onExcluir={excluirConteudo}
            />
          ))
        )}
      </ScrollView>

      {/* MODAL DE EDIÇÃO DE IMAGEM */}
      <Portal>
        <Dialog visible={dialogEdicao} onDismiss={() => setDialogEdicao(false)}>
          <Dialog.Title>Editar Imagem</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="URL da Imagem"
              value={novaImagemUrl}
              onChangeText={setNovaImagemUrl}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="outlined"
              icon="image"
              onPress={escolherFotoGaleria}
            >
              Escolher Foto da Galeria
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogEdicao(false)}>Cancelar</Button>
            <Button onPress={salvarNovaImagem}>Salvar Imagem</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default AppBar;