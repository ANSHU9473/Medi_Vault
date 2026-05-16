const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { getFolders, createFolder, getFolderById, updateFolder, deleteFolder } = require('../controllers/folderController');

router.get('/', protect, getFolders);
router.post('/', protect, createFolder);
router.get('/:id', protect, getFolderById);
router.put('/:id', protect, updateFolder);
router.delete('/:id', protect, deleteFolder);

module.exports = router;
