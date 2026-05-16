const Folder = require('../models/Folder');

exports.getFolders = async (req, res) => {
    try {
        const folders = await Folder.find({ userId: req.user.id });
        const Report = require('../models/Report');
        
        const foldersWithDocs = await Promise.all(folders.map(async (folder) => {
            const documents = await Report.find({ folder: folder._id });
            return {
                ...folder.toObject(),
                documents
            };
        }));
        
        res.json({ folders: foldersWithDocs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createFolder = async (req, res) => {
    try {
        const { name, icon, color } = req.body;
        const folder = new Folder({
            name,
            icon: icon || '📁',
            color: color || '#0d9488',
            userId: req.user.id,
            type: 'folder'
        });
        await folder.save();
        res.status(201).json({ folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFolderById = async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        
        const Report = require('../models/Report');
        const documents = await Report.find({ folder: folder._id }).sort({ createdAt: -1 }) || [];
        
        res.json({ folder, documents });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateFolder = async (req, res) => {
    try {
        const { name, icon, color } = req.body;
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, icon, color },
            { new: true }
        );
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json({ folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json({ message: 'Folder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
