import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

let users

export default class UserDAO {
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db("Foodordering").collection("users")
        } catch (e) {
            console.error(`Unable to establish collection handles in UserDAO: ${e}`)
        }
    }

static async addUser(fname, lname, email, mobileno,role, password) {
    try {
        const count = await users.countDocuments();
        const userId = (count + 1).toString().padStart(3, '0');
        const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // get current date in ISO format
        const addDoc = {
            userId: userId,
            fname: fname,
            lname: lname,
            email: email,
            mobileno: mobileno,
            password: password,
            role: role,
            createDate: currentDate // add the current date to the document
        }
        return await users.insertOne(addDoc);
    } catch (e) {
        console.error(`Unable to add user: ${e}`);
        return { error: e };
    }
}



    static async createUser(userInfo) {
        const { fname, lname, email, mobileno, role, password } = userInfo;
        const user = {
          _id: ObjectId(), // generate unique id for user
          fname: fname,
          lname: lname,
          email: email.toLowerCase(),
          mobileno: mobileno,
          password: password,
          role: role,
        };
        
        try {
          const existingUser = await users.findOne({ email: user.email });
          if (existingUser) {
            throw new Error("Email already exists");
          }
      
          const result = await users.insertOne(user);
          return user;
        } catch (e) {
          console.error(`Unable to create user: ${e}`)
          throw new Error(`Unable to create user: ${e.message}`)
        }
    }

    static async getUserByEmail(email) {
        try {
            return await users.findOne({ email: email })
        } catch (e) {
            console.error(`Unable to get user: ${e}`)
            return null
        }
    }
}
