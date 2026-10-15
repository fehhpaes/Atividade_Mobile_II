const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
    },
    telefone: {
      type: String,
      default: '',
    },
    cpf: {
      type: String,
      default: '',
    },
    imagem: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: true, // Por padrão, usuários cadastrados podem acessar a área admin nesta atividade
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Usuario', UsuarioSchema);
