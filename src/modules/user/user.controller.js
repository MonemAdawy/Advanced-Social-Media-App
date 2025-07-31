import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import * as userService from "./user.services.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import isAuthorized from "../../middleware/authorization.middlware.js";
import endpoints from "./user.endpoint.js";
import { fileValidation, upload } from "../../utils/file uploading/multerUpload.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";


const router = Router();

router.post("/profile", asyncHandler(isAuthenticated), isAuthorized(endpoints.profile), asyncHandler(userService.profile));

router.post("/update-username", asyncHandler(isAuthenticated), isAuthorized(endpoints.updateUsername), asyncHandler(userService.updateUsername));

router.post("/update-email", asyncHandler(isAuthenticated), isAuthorized(endpoints.updateEmail), asyncHandler(userService.updateEmail));

router.get("/confirm-email/:token", asyncHandler(userService.confirmEmail));

router.post("/update-password", asyncHandler(isAuthenticated), isAuthorized(endpoints.updatePassword), asyncHandler(userService.updatePassword));

router.post("/deactivate-account", asyncHandler(isAuthenticated), isAuthorized(endpoints.deactivateAccount), asyncHandler(userService.deactivateAccount));

// router.post("/profilePicture", asyncHandler(isAuthenticated), upload(fileValidation.images, "uploads/users").single("image"), asyncHandler(userService.profilePicture));

router.post("/profilePicture", asyncHandler(isAuthenticated), uploadCloud().single("image"), asyncHandler(userService.profilePicture));

router.delete("/deleteProfilePicture", asyncHandler(isAuthenticated), asyncHandler(userService.deleteProfilePicture));

router.post("/coverPics", asyncHandler(isAuthenticated), upload(fileValidation.images).array("images"), asyncHandler(userService.coverPictures));

export default router;