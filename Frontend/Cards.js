import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Button,
  Text,
  IconButton,
  Portal,
  Modal,
  Chip,
  Divider,
} from 'react-native-paper';
import { styles } from './css/Styles';

const ModCard = ({ conteudo }) => {
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const item = conteudo || {
    titulo: 'Breaking Bad',
    subtitulo: '1x01 - Pilot',
    categoria: 'SÉRIES',
    imagem: 'https://picsum.photos/seed/bb/700/400',
    descricao: '',
  };

  const categoria = item.categoria || 'SÉRIES';
  const subtituloTexto = item.subtitulo
    ? `${item.subtitulo} • ${categoria}`
    : categoria;

  return (
    <>
      <Card style={styles.card} onPress={() => setModalDetalhes(true)}>
        <Card.Title
          title={item.titulo}
          subtitle={subtituloTexto}
          titleStyle={styles.cardTitle}
          subtitleStyle={{ color: '#eda73e', fontWeight: 'bold' }}
        />
        <Card.Cover
          style={styles.cardCover}
          source={{
            uri: item.imagem || 'https://picsum.photos/700/400',
          }}
        />

        <Card.Actions style={styles.cardActions}>
          <Button
            icon="information-outline"
            mode="text"
            textColor="#eda73e"
            onPress={() => setModalDetalhes(true)}
          >
            Ver detalhes
          </Button>
        </Card.Actions>
      </Card>

      {/* TELA SOBREPOSTA (MODAL DE DETALHES COMPLETOS) */}
      <Portal>
        <Modal
          visible={modalDetalhes}
          onDismiss={() => setModalDetalhes(false)}
          contentContainerStyle={modalStyles.modalContainer}
        >
          <ScrollView
            style={modalStyles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Imagem de Capa com Badge de Categoria e Botão Fechar */}
            <View style={modalStyles.imagemContainer}>
              <Image
                source={{ uri: item.imagem || 'https://picsum.photos/700/400' }}
                style={modalStyles.imagem}
                resizeMode="cover"
              />
              <IconButton
                icon="close"
                iconColor="#FFFFFF"
                size={22}
                style={modalStyles.botaoFechar}
                onPress={() => setModalDetalhes(false)}
              />
              <View style={modalStyles.chipContainer}>
                <Chip
                  style={modalStyles.chip}
                  textStyle={modalStyles.chipTexto}
                  compact
                >
                  {categoria}
                </Chip>
              </View>
            </View>

            {/* Informações detalhadas do conteúdo */}
            <View style={modalStyles.corpo}>
              <Text variant="headlineSmall" style={modalStyles.titulo}>
                {item.titulo}
              </Text>

              {item.subtitulo ? (
                <Text variant="titleMedium" style={modalStyles.subtitulo}>
                  {item.subtitulo}
                </Text>
              ) : null}

              <Divider style={{ marginVertical: 14 }} />

              <Text variant="titleSmall" style={modalStyles.secaoTitulo}>
                Sinopse / Descrição
              </Text>
              <Text variant="bodyMedium" style={modalStyles.descricao}>
                {item.descricao && item.descricao.trim()
                  ? item.descricao
                  : 'Nenhuma descrição detalhada cadastrada para este conteúdo.'}
              </Text>

              <Button
                mode="contained"
                buttonColor="#eda73e"
                textColor="#FFFFFF"
                style={{ marginTop: 12, borderRadius: 8 }}
                onPress={() => setModalDetalhes(false)}
              >
                Fechar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 30,
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '85%',
    elevation: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  imagemContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  botaoFechar: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 0,
  },
  chipContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  chip: {
    backgroundColor: '#eda73e',
  },
  chipTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  corpo: {
    padding: 20,
  },
  titulo: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitulo: {
    color: '#666666',
    marginTop: 4,
  },
  secaoTitulo: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  descricao: {
    color: '#444444',
    lineHeight: 22,
    marginBottom: 16,
  },
});

export default ModCard;