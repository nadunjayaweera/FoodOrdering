import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let item;
let sale;
let menus;
let rowitems;

// Object to keep track of cumulative quantities for each product
let cumulativeQuantities = {};

export default class DataDAO {
  static async injectDB(conn) {
    if (item && sale && menus && rowitems) {
      return;
    }
    try {
      item = await conn.db("Foodordering").collection("item");
      sale = await conn.db("Foodordering").collection("sales");
      menus = await conn.db("Foodordering").collection("menus");
      rowitems = await conn.db("Foodordering").collection("rowitem");
    } catch (err) {
      console.error(
        `Unable to establish collection handles in DataDAO: ${err}`
      );
    }
  }

  static async addSale(
    customerName,
    products,
    totalPrice,
    productStatus,
    email
  ) {
    if (!sale || !menus || !rowitems) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const lastSale = await sale.findOne({}, { sort: { orderId: -1 } });
      const lastOrderId = lastSale ? parseInt(lastSale.orderId, 10) : 0;

      let newOrderId = lastOrderId + 1;
      if (newOrderId >= 10000) {
        newOrderId = (newOrderId % 10000) + 1;
      }
      const formattedOrderId = newOrderId.toString().padStart(4, "0");

      const timestamp = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const sales = {
        orderId: formattedOrderId,
        customerName,
        products,
        totalPrice,
        productStatus,
        timestamp,
        email,
      };

      const result = await sale.insertOne(sales);

      // Fetch and log menu details for each product in the order
      for (const product of products) {
        const productName = product.productName;
        const quantityOrdered = product.quantity;

        // Fetch menu details for the product from the menus collection
        const menuDetails = await menus.findOne({ menu: productName });

        if (menuDetails) {
          // Multiply the menu item quantity by the quantity ordered
          const updatedMenuItems = menuDetails.items.map((item) => ({
            ...item,
            quantity: (
              parseInt(item.quantity, 10) * parseInt(quantityOrdered, 10)
            ).toString(),
          }));

          // Update cumulative quantities for the product
          if (!cumulativeQuantities[productName]) {
            cumulativeQuantities[productName] = {
              ...menuDetails,
              items: updatedMenuItems,
            };
          } else {
            cumulativeQuantities[productName].items.forEach((item, index) => {
              const existingItem = updatedMenuItems.find(
                (updatedItem) => updatedItem.name === item.name
              );

              if (existingItem) {
                item.quantity = (
                  parseInt(item.quantity, 10) +
                  parseInt(existingItem.quantity, 10)
                ).toString();
              }
            });
          }

          console.log(
            `Updated menu details for product "${productName}":`,
            cumulativeQuantities[productName]
          );
        } else {
          console.log(`Menu details not found for product "${productName}"`);
        }
      }

      // Create a new object to store merged quantities for each item
      const mergedQuantities = {};

      // Iterate over cumulativeQuantities and merge quantities for items with the same name
      Object.values(cumulativeQuantities).forEach(({ items }) => {
        items.forEach(({ name, quantity, unit }) => {
          if (!mergedQuantities[name]) {
            mergedQuantities[name] = { name, quantity, unit };
          } else {
            mergedQuantities[name].quantity = (
              parseInt(mergedQuantities[name].quantity, 10) +
              parseInt(quantity, 10)
            ).toString();
          }
        });
      });

      // Convert the mergedQuantities object to an array
      const combinedItems = Object.values(mergedQuantities);

      console.log(`Combined quantities for all items:`, combinedItems);

      // Reset variables after processing
      this.resetVariables();

      return result.insertedId;
    } catch (err) {
      console.error(`Error adding sale: ${err}`);
      throw err;
    }
  }

  static resetVariables() {
    cumulativeQuantities = {};
  }

  static async getItem() {
    if (!item) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const cursor = await item.find({}).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getItempart(pageNumber, itemsPerPage) {
    if (!item) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const skip = (pageNumber - 1) * itemsPerPage;
      const cursor = await item
        .find({})
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async updateItem(itemId, productStatus) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const itemToUpdate = await sale.findOne({ _id: ObjectId(itemId) });

      if (!itemToUpdate) {
        throw new Error("Item not found");
      }

      await sale.updateOne(
        { _id: ObjectId(itemId) },
        { $set: { productStatus } }
      );

      return true; // Return a success flag if the update is successful
    } catch (err) {
      console.error(`Error updating product status: ${err}`);
      return false; // Return a failure flag if an error occurs during the update
    }
  }

  static async getProductStatus(itemId) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }

    try {
      const item = await sale.findOne(
        { _id: ObjectId(itemId) },
        { projection: { productStatus: 1 } }
      );

      if (!item) {
        throw new Error("Item not found");
      }

      return item.productStatus;
    } catch (err) {
      console.error(`Error getting product status: ${err}`);
      throw err;
    }
  }

  static async getSale() {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const cursor = await sale.find({}).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getUserOrders(email) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }

    try {
      const cursor = await sale.find({ email: email }).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting user orders: ${err}`);
      throw err;
    }
  }

  static async getSalesByDate(date) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }

    try {
      const pipeline = [
        {
          $match: {
            timestamp: date,
          },
        },
        {
          $unwind: "$products", // Unwind the products array
        },
        {
          $group: {
            _id: "$products.productName", // Group by product name
            totalQuantity: { $sum: "$products.quantity" }, // Sum the quantities for each product
          },
        },
      ];

      const result = await sale.aggregate(pipeline).toArray();
      return result;
    } catch (err) {
      console.error(`Error getting sales by date: ${err}`);
      throw err;
    }
  }
}
