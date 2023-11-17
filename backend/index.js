import app from "./server.js";
import mongodb from "mongodb";
import SignupDAO from "./dao/signupDAO.js";
import LoginDAO from "./dao/loginDAO.js"; // add import for login DAO
import loginRoutes from "./api/login.route.mjs"; // add import for login routes
import UsersDAO from "./dao/usersDAO.js"; // import users DAO
import userRoutes from "./api/users.route.mjs";
import ItemDAO from "./dao/additemDAO.js";
import DataDAO from "./dao/dataDAO.js"; // import data DAO
import RowItemDAO from "./dao/addrowitemDAO.js";
import MenuDAO from "./dao/addmenuDAO.js";
const MongoClient = mongodb.MongoClient;

// const uri = `mongodb+srv://nadunmj:EYO4y6xhMq0PzxDX@cluster0.idbvi1f.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://localhost:27017`;
const port = 8080;

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await SignupDAO.injectDB(client);
    await LoginDAO.injectDB(client); // inject login DAO
    await UsersDAO.injectDB(client); // inject users DAO
    await ItemDAO.injectDB(client); // inject item
    await RowItemDAO.injectDB(client); // inject row
    await MenuDAO.injectDB(client); // inject menu
    await DataDAO.injectDB(client); // inject data DAO

    app.use("/login", loginRoutes); // mount login routes
    // app.use("/users", userRoutes); // mount users routes
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
