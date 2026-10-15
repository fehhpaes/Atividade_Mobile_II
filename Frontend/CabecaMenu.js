import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const CabecalhoMenu = () => {
  const navigation = useNavigation();
  const { usuario, autenticado, logout } = useAuth();
  const [dialogSair, setDialogSair] = useState(false);

  const confirmarSaida = () => {
    setDialogSair(false);
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Área do usuário (Requisito 3: Identificação do usuário logado) */}
      <View style={styles.usuario}>
        {usuario?.imagem ? (
          <Avatar.Image size={65} source={{ uri: usuario.imagem }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={65} icon="account" style={styles.avatar} />
        )}

        <View style={styles.informacoes}>
          <Text variant="titleMedium" style={styles.nome}>
            {autenticado ? usuario.nome : 'Visitante'}
          </Text>

          <Text variant="bodyMedium" style={styles.email} numberOfLines={1}>
            {autenticado ? usuario.email : 'Toque para entrar'}
          </Text>
        </View>
      </View>

      {/* Se não autenticado, atalho para Login/Cadastro */}
      {!autenticado && (
        <View style={styles.itemMenu}>
          <Text variant="bodyMedium" style={styles.itemTexto}>
            Entrar / Cadastrar
          </Text>
          <IconButton
            icon="login"
            iconColor="white"
            size={24}
            onPress={() => navigation.navigate('Acesso')}
          />
        </View>
      )}

      {/* Área do perfil */}
      <View style={styles.itemMenu}>
        <Text variant="bodyMedium" style={styles.itemTexto}>
          Meu perfil
        </Text>
        <IconButton
          icon="account"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate(autenticado ? 'Perfil' : 'Acesso')}
        />
      </View>

      {/* Área Administrativa (Requisito 2 e 4: Gerenciamento) */}
      <View style={styles.itemMenu}>
        <Text variant="bodyMedium" style={styles.itemTexto}>
          Área Administrativa
        </Text>
        <IconButton
          icon="shield-account"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Admin')}
        />
      </View>

      {/* Área de Pesquisa (Requisito 6) */}
      <View style={styles.itemMenu}>
        <Text variant="bodyMedium" style={styles.itemTexto}>
          Pesquisa
        </Text>
        <IconButton
          icon="magnify"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Pesquisa')}
        />
      </View>

      {/* Área de Sair (se logado) */}
      {autenticado && (
        <View style={styles.itemMenu}>
          <Text variant="bodyMedium" style={styles.itemTexto}>
            Sair
          </Text>
          <IconButton
            icon="logout"
            iconColor="white"
            size={24}
            onPress={() => setDialogSair(true)}
          />
        </View>
      )}

      {/* Dialog de confirmação de saída */}
      <Portal>
        <Dialog visible={dialogSair} onDismiss={() => setDialogSair(false)}>
          <Dialog.Title>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text>Deseja realmente sair da sua conta?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogSair(false)}>Cancelar</Button>
            <Button onPress={confirmarSaida}>Sair</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C0C0C0',
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#F2A900',
  },
  informacoes: {
    flex: 1,
    marginLeft: 15,
  },
  nome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 19,
  },
  email: {
    color: '#FFFFFF',
    marginTop: 3,
  },
  itemMenu: {
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export { CabecalhoMenu };