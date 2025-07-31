import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

export const fileValidation = {
    images: ["image/png", "image/jpeg"],
    files: ["application/pdf"],
}

export const upload = (fileType, folder) => {
    const storage = diskStorage({
        // destination: folder,
        destination: (req, file, cb) => {
            const folderPath = path.resolve(".", `${folder}/${req.user._id}`);
            fs.mkdirSync(folderPath, {recursive: true});
            const folderName = `${folder}/${req.user._id}`;
            cb(null, folderName);
        },
        filename: (req, file, cb) => {
            cb(null, nanoid() + "__" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!fileType.includes(file.mimetype)) {
            cb(new Error("Invalid format"), false);
        } else {
            cb(null, true);
        }
    }

    return multer({ storage, fileFilter });
}