import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        backgroundColor: 'gray',
        borderRadius: 150,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f0e0e',
    },

    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: '#0d0d0d',
    },
    header: {
        backgroundColor: '#C0C0C0',
    },
    tabs: {
        height: 100,
        flexGrow: 0,
    },
    tab: {
        height: 45,
        paddingHorizontal: 20,
        marginHorizontal: 2,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',

        borderWidth: 1,
        borderColor: '#C0C0C0',

        borderRadius: 5,
        marginTop: 10,


    },
    tabsContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    tabText: {
        color: '#0b0b0b',
        fontSize: 14,
        fontWeight: 'bold',
    },
// ========= CARD  ================
   
    cards: {
        flex: 1,
    },

    cardsContent: {
        paddingHorizontal: 10,
        paddingTop: 0,
        paddingBottom: 30,
    },

    card: {
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 10,

        borderRadius: 10,
        backgroundColor: '#FFFFFF',

        elevation: 4,
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardCover: {
        height: 200,
        borderRadius: 0,
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
    },
// ========= ACESSO  ================
  

   acesso: {
    padding: 25,
    justifyContent: 'center',
},
acessoTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',  
    marginBottom: 10,
},
acessoTexto: {
    textAlign: 'center',
    marginBottom: 30,
},
acessoButton: {
    marginBottom: 15,
    borderRadius: 5,
},

// ========= LOGIN   ================

loginContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
},

loginContent: {
    padding: 25,
},

loginTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 30,
},

loginTexto: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
},

input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
},

loginButton: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
},
// =========================
// CADASTRO
// =========================

cadastroContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
},

cadastroContent: {
    padding: 25,
},

cadastroTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
},

cadastroTexto: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
},

cadastroButton: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
},
// ========= CABEÇALHO DO MENU ================
menuHeader: {
                padding: 20,
                backgroundColor: '#C0C0C0',
            }

});