import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import {
  Appbar,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { API_URL } from './api';
import { useAuth } from './AuthContext';

const CATEGORIAS = ['TODOS', 'SÉRIES', 'FILMES', 'DOCUMENTÁRIOS', 'LANÇAMENTOS'];

const AppBar = ({ navigation }) => {
  const { autenticado } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');

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

  const conteudosFiltrados = conteudos.filter((item) => {
    if (categoriaAtiva === 'TODOS') return true;
    return (item.categoria || 'SÉRIES').toUpperCase() === categoriaAtiva.toUpperCase();
  });

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
        {CATEGORIAS.map((cat) => {
          const ativa = categoriaAtiva === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => setCategoriaAtiva(cat)}
              style={[
                styles.tab,
                ativa && { backgroundColor: '#eda73e', borderColor: '#eda73e' },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  ativa && { color: '#FFFFFF', fontWeight: 'bold' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
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
        ) : conteudosFiltrados.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text>Nenhum conteúdo encontrado na categoria "{categoriaAtiva}".</Text>
            {autenticado && (
              <Button
                mode="contained"
                style={{ marginTop: 15 }}
                onPress={() => navigation.navigate('Admin')}
              >
                Cadastrar em {categoriaAtiva === 'TODOS' ? 'SÉRIES' : categoriaAtiva}
              </Button>
            )}
          </View>
        ) : (
          conteudosFiltrados.map((item) => (
            <ModCard
              key={item._id}
              conteudo={item}
            />
          ))
        )}
      </ScrollView>
    </>
  );
};

export default AppBar;