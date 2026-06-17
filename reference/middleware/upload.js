// Configures where uploaded photos/videos get saved on disk, and
// what file types/sizes are allowed for each.
const multer = require('multer');
const path = require('path');
const fs = require('fs');

function makeStorage(folderName) {
  const dir = path.join(__dirname, '..', 'uploads', folderName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
}

const uploadPhoto = multer({
  storage: makeStorage('photos'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const uploadVideo = multer({
  storage: makeStorage('videos'),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files are allowed'));
  },
});

module.exports = { uploadPhoto, uploadVideo };
