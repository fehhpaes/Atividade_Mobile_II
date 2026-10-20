require('dotenv').config();
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const Usuario = require('./models/Usuario');
const Conteudo = require('./models/Conteudo');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===================================
// Middlewares
// ===================================
app.use(cors());
// Limite ampliado para permitir fotos em base64 se enviadas pelo app
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// ===================================
// Conexão com o Banco de Dados (Mongoose)
// ===================================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Conectado com sucesso ao MongoDB:', MONGO_URI);
  })
  .catch((err) => {
    console.warn(' Aviso: Não foi possível conectar ao MongoDB:', err.message);
    console.warn('   (Certifique-se de iniciar o serviço do MongoDB para persistir dados)');
  });

// ===================================
// Rota de Healthcheck
// ===================================
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Atividade Mobile está ativa com Express!',
    status: 'online',
    bancoConectado: mongoose.connection.readyState === 1,
    timestamp: new Date(),
  });
});

// ===================================
// Cadastro de Usuário
// ===================================
app.post('/api/auth/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone, cpf } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // Verificar se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const novoUsuario = await Usuario.create({
      nome,
      email: email.toLowerCase(),
      senha,
      telefone: telefone || '',
      cpf: cpf || '',
      isAdmin: true,
    });

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
        cpf: novoUsuario.cpf,
        imagem: novoUsuario.imagem,
        isAdmin: novoUsuario.isAdmin,
      },
    });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário no servidor.' });
  }
});

// ===================================
// Login
// ===================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    return res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        cpf: usuario.cpf,
        imagem: usuario.imagem,
        isAdmin: usuario.isAdmin,
      },
      token: `auth-token-${usuario._id}`,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro ao processar login no servidor.' });
  }
});

// ===================================
// Identificação e Perfil do Usuário
// ===================================
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar perfil do usuário.' });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { nome, telefone, cpf, imagem, senha } = req.body;
    const updateData = {};

    if (nome) updateData.nome = nome;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (imagem !== undefined) updateData.imagem = imagem;
    if (senha) updateData.senha = senha;

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-senha');

    if (!usuarioAtualizado) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json({
      mensagem: 'Perfil atualizado com sucesso!',
      usuario: usuarioAtualizado,
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return res.status(500).json({ erro: 'Erro ao atualizar dados do perfil.' });
  }
});

// ===================================
// Conteúdos (Listagem Pública e Cadastro Admin)
// ===================================

// Listar todos os conteúdos (público) - aceita filtro opcional por categoria (categoria=FILMES)
app.get('/api/conteudos', async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = {};
    if (categoria && categoria.trim() && categoria.toUpperCase() !== 'TODOS') {
      filtro.categoria = new RegExp(`^${categoria.trim()}$`, 'i');
    }

    const conteudos = await Conteudo.find(filtro).sort({ createdAt: -1 });
    return res.json(conteudos);
  } catch (err) {
    console.error('Erro ao buscar conteúdos:', err);
    return res.status(500).json({ erro: 'Erro ao listar conteúdos.' });
  }
});

// Cadastrar novo conteúdo (Área Administrativa)
app.post('/api/conteudos', async (req, res) => {
  try {
    const { titulo, subtitulo, imagem, descricao, categoria, usuarioId } = req.body;

    if (!titulo || !imagem) {
      return res.status(400).json({ erro: 'Título e imagem são obrigatórios.' });
    }

    const novoConteudo = await Conteudo.create({
      titulo,
      subtitulo: subtitulo || '',
      imagem,
      descricao: descricao || '',
      categoria: categoria || 'SÉRIES',
      criadoPor: usuarioId || null,
    });

    return res.status(201).json({
      mensagem: 'Conteúdo cadastrado com sucesso!',
      conteudo: novoConteudo,
    });
  } catch (err) {
    console.error('Erro ao cadastrar conteúdo:', err);
    return res.status(500).json({ erro: 'Erro ao salvar novo conteúdo.' });
  }
});

// ===================================
// Gerenciamento de Imagens (Editar e Excluir Conteúdo/Imagem)
// ===================================

// Editar conteúdo ou imagem (Apenas autenticado)
app.put('/api/conteudos/:id', async (req, res) => {
  try {
    const { titulo, subtitulo, imagem, descricao, categoria } = req.body;
    const updateData = {};

    if (titulo) updateData.titulo = titulo;
    if (subtitulo !== undefined) updateData.subtitulo = subtitulo;
    if (imagem) updateData.imagem = imagem;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (categoria) updateData.categoria = categoria;

    const conteudoAtualizado = await Conteudo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!conteudoAtualizado) {
      return res.status(404).json({ erro: 'Conteúdo não encontrado.' });
    }

    return res.json({
      mensagem: 'Conteúdo/imagem atualizado com sucesso!',
      conteudo: conteudoAtualizado,
    });
  } catch (err) {
    console.error('Erro ao editar conteúdo:', err);
    return res.status(500).json({ erro: 'Erro ao editar conteúdo.' });
  }
});

// Excluir conteúdo e sua imagem (Apenas autenticado)
app.delete('/api/conteudos/:id', async (req, res) => {
  try {
    const conteudoExcluido = await Conteudo.findByIdAndDelete(req.params.id);

    if (!conteudoExcluido) {
      return res.status(404).json({ erro: 'Conteúdo não encontrado para exclusão.' });
    }

    return res.json({
      mensagem: 'Conteúdo e imagem excluídos com sucesso!',
      id: req.params.id,
    });
  } catch (err) {
    console.error('Erro ao excluir conteúdo:', err);
    return res.status(500).json({ erro: 'Erro ao excluir conteúdo.' });
  }
});

// ===================================
// Pesquisa por termo
// ===================================
app.get('/api/conteudos/pesquisa', async (req, res) => {
  try {
    const { termo } = req.query;

    if (!termo || !termo.trim()) {
      const todos = await Conteudo.find().sort({ createdAt: -1 });
      return res.json(todos);
    }

    const regex = new RegExp(termo.trim(), 'i');

    const resultados = await Conteudo.find({
      $or: [
        { titulo: regex },
        { subtitulo: regex },
        { descricao: regex },
      ],
    }).sort({ createdAt: -1 });

    return res.json(resultados);
  } catch (err) {
    console.error('Erro na pesquisa:', err);
    return res.status(500).json({ erro: 'Erro ao realizar pesquisa.' });
  }
});

// ===================================
// Inicialização do Servidor
// ===================================
app.listen(PORT, () => {
  console.log(` Servidor Express pronto e rodando na porta ${PORT}`);
  console.log(` URL base da API: http://localhost:${PORT}`);
});
