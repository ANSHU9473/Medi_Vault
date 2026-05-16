const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: '📁' },
    color: { type: String, default: '#0d9488' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'folder' }
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);
