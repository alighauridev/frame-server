import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, "ali1245", {
        expiresIn: "30d",
    });
};

export default generateToken;
