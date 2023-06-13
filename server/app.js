if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;
const errorHandler = require("./middleware/errorhandler");
const Controller = require('./controllers/controller')
const { authUser } = require('./middleware/auth')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////ROUTES////
app.post('/register', Controller.register);
app.post('/login', Controller.login);
app.use(authUser);
app.get('/view-data', Controller.viewData);
app.post('/logout', Controller.login);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})