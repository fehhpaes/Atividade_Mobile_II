const mongoose = require('mongoose');

const ConteudoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    subtitulo: {
      type: String,
      default: '',
      trim: true,
    },
    imagem: {
      type: String,
      required: [true, 'A URL ou imagem é obrigatória'],
    },
    descricao: {
      type: String,
      default: '',
    },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice de texto para facilitar a busca por termo no título e subtítulo
ConteudoSchema.index({ titulo: 'text', subtitulo: 'text', descricao: 'text' });

module.exports = mongoose.model('Conteudo', ConteudoSchema);
