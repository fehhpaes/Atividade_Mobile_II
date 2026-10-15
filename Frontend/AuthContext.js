import React, { createContext, useContext, useState } from 'react';
import { API_URL } from './api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login
  const login = async (email, senha) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { sucesso: false, erro: data.erro || 'Falha ao realizar login' };
      }

      setUsuario(data.usuario);
      return { sucesso: true, usuario: data.usuario };
    } catch (err) {
      return { sucesso: false, erro: 'Não foi possível conectar ao servidor.' };
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const cadastro = async ({ nome, email, senha, telefone, cpf }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, telefone, cpf }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { sucesso: false, erro: data.erro || 'Falha ao realizar cadastro' };
      }

      // Ao cadastrar, já autentica o usuário
      setUsuario(data.usuario);
      return { sucesso: true, usuario: data.usuario };
    } catch (err) {
      return { sucesso: false, erro: 'Não foi possível conectar ao servidor.' };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const atualizarPerfil = async (novosDados) => {
    if (!usuario?.id) return { sucesso: false, erro: 'Nenhum usuário logado.' };

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novosDados),
      });

      const data = await res.json();
      if (!res.ok) {
        return { sucesso: false, erro: data.erro || 'Falha ao atualizar perfil' };
      }

      setUsuario((prev) => ({ ...prev, ...data.usuario }));
      return { sucesso: true, usuario: data.usuario };
    } catch (err) {
      return { sucesso: false, erro: 'Não foi possível conectar ao servidor.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        loading,
        login,
        cadastro,
        atualizarPerfil,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
