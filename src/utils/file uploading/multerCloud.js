import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";


export const fileValidation = {
    images: ["image/png", "image/jpeg"],
    files: ["application/pdf"],
}

export const uploadCloud = () => {
    const storage = diskStorage({});

    const multerUpload = multer({ storage });


    return multerUpload;
}
