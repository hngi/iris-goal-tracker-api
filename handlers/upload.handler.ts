import multer from 'multer';

class UploadHandler {
  private storage() {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
      }
    });
  }

  private fileFilter(req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      // rejects storing a file
      cb(null, false);
    }
  }

  public upload() {
    return multer({
      storage: this.storage(),
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: this.fileFilter
    });
  }
}
export default new UploadHandler()