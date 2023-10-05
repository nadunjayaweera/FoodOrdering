import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

let users

 class LoginDAO {
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db("Foodordering").collection("users")
        } catch (e) {
            console.error(`Unable to establish collection handles in LoginDAO: ${e}`)
        }
    }

    static async getUserByEmailAndPassword(email, password) {
        try {
            return await users.findOne({ email: email, password: password })
        } catch (e) {
            console.error(`Unable to get user: ${e}`)
            return null
        }
    }
}

export default LoginDAO;
