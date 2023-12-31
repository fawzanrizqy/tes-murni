const { User, Log, Data } = require('../models');
const { checkPass } = require('../helpers/encryptor');
const { signToken } = require('../helpers/jwt');

class Controller {

    static async register(req, res, next) {
        try {
            const { username, password, age } = req.body;

            if (!username || !password || !age) {
                throw {
                    name: "ValidationError",
                    message: 'Please fill all fields',
                    code: 400
                }
            }

            if (age < 18) {
                throw {
                    name: "ValidationError",
                    message: 'Age must be greater than 18',
                    code: 400
                }
            }

            let flagUpper = false;
            let flagLower = false;
            let flagNumber = false;
            for (let i = 0; i < password.length; i++) {
                if (password[i] === password[i].toUpperCase()) {
                    flagUpper = true;
                }
                if (password[i] === password[i].toLowerCase()) {
                    flagLower = true;
                }
                if (!isNaN(password[i])) {
                    flagNumber = true;
                }
            }
            if (!flagNumber) {
                throw { name: "validationError", message: "Password must contain at least one number", code: 400 }
            }

            if (!flagUpper || !flagLower || !flagNumber) {
                throw { name: "validationError", message: "Password must contain at least one uppercase, lowercase, number", code: 400 }
            }
            const user = await User.create({ username, password, age });
            const log = await Log.create({ log: `User ${user.username} created successfully` });
            res.status(201).json({ message: "User created successfully", data: user });

        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw { name: "ValidationError", message: "Please fill all fields", code: 400 }
            }
            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw { name: "ValidationError", message: "Invalid username or password", code: 400 }
            }
            const isValidPass = checkPass(password, user.password);
            if (!isValidPass) {
                throw { name: "ValidationError", message: "Invalid username or password", code: 400 }
            }

            const access_token = signToken({ id: user.id, username: user.username });
            const log = await Log.create({ log: `User ${user.username} login successfully` });

            res.status(200).json({ message: "User logged in successfully", data: user, access_token });

        } catch (err) {
            next(err);
        }
    }

    static async viewData(req, res, next) {
        try {

            const data = await Data.findAll();

            let FinalResults = {};
            const query = [
                'CALL calculate_average_score();',
                'CALL calculate_modus_emotion();',
                'CALL calculate_average_score_and_mode_emotion();'
            ];


            for (let i = 0; i < query.length; i++) {
                const [results] = await Data.sequelize.query(query[i]);
                if (results) {
                    Object.keys(results).forEach(key => {
                        FinalResults[key] = results[key];
                    });
                }
            }

            res.json({ data, FinalResults });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res, next) {
        try {
            const id = req.user.id;
            const user = await User.findOne({ where: { id } });
            const log = await Log.create({ log: `User ${user.username} created successfully` });
            res.status(200).json({ message: "User logged out successfully" });

        } catch (err) {
            next(err);
        }
    }

}

module.exports = Controller;