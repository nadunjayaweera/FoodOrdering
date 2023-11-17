import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let menus;

export default class MenuDAO {
  static async injectDB(conn) {
    if (menus) {
      return;
    }
    try {
      menus = await conn.db("Foodordering").collection("menus");
    } catch (e) {
      console.error(`Unable to establish collection handles in MenuDAO: ${e}`);
    }
  }

  static async addMenu(menu) {
    if (!menus) {
      throw new Error("MenuDAO not initialized");
    }
    try {
      const result = await menus.insertOne(menu);
      if (result && result.ops && result.ops.length > 0) {
        const insertedMenu = result.ops[0];
        return insertedMenu;
      } else {
        throw new Error("Insertion failed, or no documents were inserted.");
      }
    } catch (err) {
      console.error(`Error adding menu: ${err}`);
      throw err;
    }
  }

  static async getMenuById(id) {
    if (!menus) {
      throw new Error("MenuDAO not initialized");
    }
    try {
      return await menus.findOne({ _id: ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get menu: ${e}`);
      return null;
    }
  }

  static async getAllMenus() {
    if (!menus) {
      throw new Error("MenuDAO not initialized");
    }
    try {
      return await menus.find({}).toArray();
    } catch (e) {
      console.error(`Unable to get menus: ${e}`);
      return [];
    }
  }
}
