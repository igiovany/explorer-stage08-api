const { hash } = require("bcryptjs")
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
    
    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, normalizedEmail, hashedPassword])

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email } = request.body
    const { id } = request.params

    const normalizedEmail = email.toLowerCase();

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if(!user) {
      throw new AppError("User not found")
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [normalizedEmail])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("This e-mail is already in use")
    }

    user.name = name
    user.email = normalizedEmail


    await database.run(`UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?`, [user.name, user.email, new Date(), id])
    return response.json()
  }
}

module.exports = UsersController