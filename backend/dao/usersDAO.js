import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db("Foodordering").collection("users");
    } catch (e) {
      console.error(`Unable to establish collection handles in UsersDAO: ${e}`);
    }
  }

  static async getUsers() {
    try {
      const userList = await users.find({}).toArray();
      return userList;
    } catch (e) {
      console.error(`Unable to get users: ${e}`);
      return null;
    }
  }
}

export default UsersDAO;
