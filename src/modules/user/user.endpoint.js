import { roles } from "../../DB/models/user.model.js";

const endpoints = {
    profile: [roles.user, roles.admin],
    updateUsername: [roles.user],
    updateEmail: [roles.user],
    updatePassword: [roles.user],
    deactivateAccount: [roles.user],
}




export default endpoints;