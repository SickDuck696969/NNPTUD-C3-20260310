let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')

module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                res.status(403).send({ message: "ban chua dang nhap" })
                return;
            }
            token = token.split(' ')[1]
            let result = jwt.verify(token, 'secret');
            let user = await userController.GetUserById(result.id);
            if (!user) {
                res.status(403).send({ message: "Token is valid, but user not found." })
            } else {
                req.user = user;
                next();
            }
        } catch (error) {
            console.log(error);
            res.status(403).send({ message: "ban chua dang nhap" })
        }
    }
}