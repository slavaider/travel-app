import nextConnect from 'next-connect';
import multer from 'multer';
const uuid = require('uuid')
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
            cb(null, uuid.v4() + '.' + file.originalname.split('.')[1])
        }
    }),
    fileFilter
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({error: `Sorry something Happened! ${error.message}`});
    },
    onNoMatch(req, res) {
        res.status(405).json({error: `Method '${req.method}' Not Allowed`});
    },
});

apiRoute.use(upload.array('theFiles'));

apiRoute.post((req, res) => {
    const RawPath = req.files[0].path
    const splited = RawPath.split('\\')
    const path = '/' + splited[1] + '/' + splited[2]
    res.status(200).json({data: path});
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
