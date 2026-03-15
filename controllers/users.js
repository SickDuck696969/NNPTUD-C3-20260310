let userModel = require("../schemas/users");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')

module.exports = {
    CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        return await userModel
            .find({ isDeleted: false })
    },
    GetUserById: async function (id) {
        try {
            const user = await userModel.findOne({ _id: id, isDeleted: false });
            return user;
        } catch (error) {
            return null;
        }
    },
    QueryLogin: async function (username, password) {
        if (!username || !password) {
            return false;
        }
        let user = await userModel.findOne({
            username: username,
            isDeleted: false
        })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                return jwt.sign({
                    id: user.id
                }, 'secret', {
                    expiresIn: '1d'
                })
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    changePassword: async function(userId, oldPassword, newPassword) {
        let user = await userModel.findById(userId);
        if (user) {
            if (bcrypt.compareSync(oldPassword, user.password)) {
                let newPasswordHash = bcrypt.hashSync(newPassword, 10);
                await userModel.updateOne({ _id: userId }, { password: newPasswordHash });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}