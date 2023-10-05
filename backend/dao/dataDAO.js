import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

// let data;
let item;
let sale;

export default class DataDAO {
    static async injectDB(conn) {
        if (/*data && */ item && sale) {
            return;
        }
        try {
            // data = await conn.db("Foodordering").collection("data");
            item = await conn.db("Foodordering").collection("item");
            sale = await conn.db("Foodordering").collection("sales");
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
        if (!sale) {
            throw new Error("DataDAO not initialized");
        }
        try {
            const lastSale = await sale.findOne({}, { sort: { orderId: -1 } }); // Find the document with the highest orderId
            const lastOrderId = lastSale ? parseInt(lastSale.orderId, 10) : 0; // Extract the orderId and convert it to a number

            let newOrderId = lastOrderId + 1;
            if (newOrderId >= 10000) {
                newOrderId = (newOrderId % 10000) + 1;
            }
            const formattedOrderId = newOrderId.toString().padStart(4, "0"); // Format the new orderId as a zero-padded 4-digit string
            const timestamp = new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });

            const sales = {
                orderId: formattedOrderId,
                customerName,
                products, // Update to include the array of products
                totalPrice, // Include the total price
                productStatus,
                timestamp: timestamp,
                email,
            };

            const result = await sale.insertOne(sales);
            return result.insertedId;
        } catch (err) {
            console.error(`Error adding sale: ${err}`);
            throw err;
        }
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
