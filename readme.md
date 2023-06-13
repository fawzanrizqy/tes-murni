# Fawzan Rizqy Ananda

This repository contains the code for your application. It is divided into two main folders: `client` and `server`.

## Installation

To get started, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the `client` folder in your terminal and run the following command to install the client-side dependencies:

   ```bash
   npm install
   ```

3. Next, navigate to the server folder in your terminal and run the following command to install the server-side dependencies:

   ```bash
   npm install
   ```

### Database Setup

Your application uses Sequelize as an ORM (Object-Relational Mapping) tool. To set up the database, follow these steps:

In the server folder, run the following command to create the database:

```bash
npx sequelize db:create
```

Run the following command to apply the database migrations:

```bash
npx sequelize db:migrate
```

Finally, run the following command to seed the database with initial data (if applicable):

```bash
npx sequelize db:seed:all
```

### Running the Server

To start the server, navigate to the server folder in your terminal and run the following command:

```bash
node app.js
```

Alternatively, if you prefer to use nodemon for automatic server restarts during development, you can install it as a dev dependency. Run the following command in the server folder:

```bash
npm install -D nodemon
```

Then, update the scripts section in your package.json file to include the following line:

```json
"start": "nodemon app.js"
```

Now, you can start the server using the following command:

```bash
npm start
```

### Running the Client

To run the client application, navigate to the client folder in your terminal and run the following command:

```bash
npm run dev
```

This will start the development server and open the application in your default browser.

That's it! You should now have your application up and running. Feel free to modify and customize it to suit your needs. Enjoy building!

If you have any questions or run into any issues, please don't hesitate to reach out for support.
