import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text, IconButton } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

const ModCard = ({ conteudo, onEditar, onExcluir }) => {
  const { autenticado } = useAuth();

  const item = conteudo || {
    titulo: 'Breaking Bad',
    subtitulo: '1x01 - Pilot',
    imagem: 'https://picsum.photos/seed/bb/700/400',
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.titulo}
        subtitle={item.subtitulo}
        titleStyle={styles.cardTitle}
      />
      <Card.Cover
        style={styles.cardCover}
        source={{
          uri: item.imagem || 'https://picsum.photos/700/400',
        }}
      />

      <Card.Actions style={styles.cardActions}>
        {/* Requisito 5: Usuários autenticados podem Editar e Excluir imagem.
            Usuários não autenticados apenas visualizam a imagem. */}
        {autenticado ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              icon="pencil"
              mode="text"
              textColor="#eda73e"
              onPress={() => onEditar && onEditar(item)}
            >
              Editar Imagem
            </Button>

            <Button
              icon="delete"
              mode="text"
              textColor="#B00020"
              onPress={() => onExcluir && onExcluir(item._id)}
            >
              Excluir
            </Button>
          </View>
        ) : (
          <Button mode="text" onPress={() => console.log('Visualizando:', item.titulo)}>
            Ver detalhes
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

export default ModCard;