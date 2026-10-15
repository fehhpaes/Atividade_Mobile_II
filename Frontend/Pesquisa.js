import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Appbar,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { API_URL } from './api';

const Pesquisa = ({ navigation }) => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Executa a busca no backend quando o termo mudar
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscarConteudos(termo);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [termo]);

  const buscarConteudos = async (texto) => {
    try {
      setCarregando(true);
      const url = texto.trim()
        ? `${API_URL}/api/conteudos/pesquisa?termo=${encodeURIComponent(texto.trim())}`
        : `${API_URL}/api/conteudos`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setResultados(data);
      }
    } catch (err) {
      console.warn('Erro na busca:', err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Pesquisa"
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <View style={{ padding: 15 }}>
        <TextInput
          label="Pesquisar por título, episódio ou sinopse"
          placeholder="Ex: Breaking Bad, Stranger, etc."
          value={termo}
          onChangeText={setTermo}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          right={
            termo ? (
              <TextInput.Icon icon="close" onPress={() => setTermo('')} />
            ) : null
          }
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}>
        {carregando ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : resultados.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Text variant="bodyLarge" style={{ color: '#777' }}>
              Nenhum resultado encontrado para "{termo}".
            </Text>
          </View>
        ) : (
          resultados.map((item) => (
            <ModCard key={item._id} conteudo={item} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Pesquisa;