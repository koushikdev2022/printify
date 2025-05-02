const { app,port } = require("./src/main/main")
const express =require("express")

require('dotenv').config();

const path = require("path");

const sequelize = require("./src/config/db")
app.use(express.static(path.join(__dirname, "./public/")));
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Unable to connect to the database:', error));
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
