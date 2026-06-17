const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcampController');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { uploadPhoto, uploadVideo } = require('../middleware/upload');

// ---- Public: anyone can view bootcamp content ----
router.get('/', bootcampController.getAll);
router.get('/:id', bootcampController.getOne);

// ---- Admin only: create/edit/delete ----
router.post('/photo', authenticate, isAdmin, uploadPhoto.single('photo'), bootcampController.uploadPhoto);
router.post('/video', authenticate, isAdmin, uploadVideo.single('video'), bootcampController.uploadVideo);
router.post('/message', authenticate, isAdmin, bootcampController.createMessage);
router.put('/:id', authenticate, isAdmin, bootcampController.update);
router.delete('/:id', authenticate, isAdmin, bootcampController.remove);

module.exports = router;
