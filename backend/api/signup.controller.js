import SignupDAO from "../dao/signupDAO.js";

export default class SignupController {
  static async apiSignup(req, res, next) {
    try {
      const { fname, lname, email, mobileno, role, password } = req.body;
      const existingUser = await SignupDAO.getUserByEmail(email);
      if (existingUser) {
        throw new Error("Email already exists");
      }
      const result = await SignupDAO.addUser(fname, lname, email, mobileno, role , password);
      if (result.error) {
        throw new Error(result.error);
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
