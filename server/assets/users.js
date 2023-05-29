import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: true,
    },

    {
        name: "User",
        email: "user@gmail.com",
        password: bcrypt.hashSync("12222", 10),
        isAdmin: false,
    },
];
export default users;
