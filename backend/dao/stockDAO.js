import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let stocks;

export default class StockDAO {
  static async injectDB(conn) {
    if (stocks) {
      return;
    }
    try {
      stocks = await conn.db("Foodordering").collection("stock");
    } catch (err) {
      console.error(
        `Unable to establish collection handles in StockDAO: ${err}`
      );
    }
  }

  static async getStockData(startDate, endDate) {
    if (!stocks) {
      throw new Error("StockDAO not initialized");
    }
    try {
      const query = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
      const cursor = await stocks.find(query).toArray();
      const aggregatedData = {};

      cursor.forEach((entry) => {
        if (!aggregatedData[entry.name]) {
          aggregatedData[entry.name] = {
            name: entry.name,
            unit: entry.unit,
            quantity: 0,
            productCost: 0,
          };
        }
        aggregatedData[entry.name].quantity += parseFloat(entry.quantity);
        aggregatedData[entry.name].productCost += parseFloat(entry.productCost);
      });

      return Object.values(aggregatedData);
    } catch (err) {
      console.error(`Error getting stock data: ${err}`);
      return { error: err };
    }
  }
}
