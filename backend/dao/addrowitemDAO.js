import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let rowitems;

export default class RowItemDAO {
  static async injectDB(conn) {
    if (rowitems) {
      return;
    }
    try {
      rowitems = await conn.db("Foodordering").collection("rowitem");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in RowItemDAO: ${e}`
      );
    }
  }

  static async addRowItem(rowitem) {
    if (!rowitems) {
      throw new Error("RowItemDAO not initialized");
    }
    try {
      const result = await rowitems.insertOne(rowitem);
      if (result && result.ops && result.ops.length > 0) {
        const insertedItem = result.ops[0];
        return insertedItem;
      } else {
        throw new Error("Insertion failed, or no documents were inserted.");
      }
    } catch (err) {
      console.error(`Error adding row item: ${err}`);
      throw err;
    }
  }

  static async updateRowItem(id, updatedRowItem) {
    if (!rowitems) {
      throw new Error("RowItemDAO not initialized");
    }
    try {
      await rowitems.updateOne({ _id: ObjectId(id) }, { $set: updatedRowItem });
    } catch (err) {
      console.error(`Error updating row item: ${err}`);
      throw err;
    }
  }

  static async deleteRowItem(id) {
    if (!rowitems) {
      throw new Error("RowItemDAO not initialized");
    }
    try {
      await rowitems.deleteOne({ _id: ObjectId(id) });
    } catch (err) {
      console.error(`Error deleting row item: ${err}`);
      throw err;
    }
  }

  static async getRowItemById(id) {
    if (!rowitems) {
      throw new Error("RowItemDAO not initialized");
    }
    try {
      return await rowitems.findOne({ _id: ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get row item: ${e}`);
      return null;
    }
  }

  static async getAllRowItems() {
    if (!rowitems) {
      throw new Error("RowItemDAO not initialized");
    }
    try {
      return await rowitems.find({}).toArray();
    } catch (e) {
      console.error(`Unable to get row items: ${e}`);
      return [];
    }
  }
}
