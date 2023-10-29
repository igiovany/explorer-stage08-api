const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const normalizedEmail = email.toLowerCase();

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (checkUserExists) {
      throw new AppError("This e-mail is already in use")
    }

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, normalizedEmail, password])

    return response.status(201).json()
  }


}

module.exports = UsersController