const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const { addTodo, getUserTodos, deleteTodos, getMyTodos, markTodos, pagination, getTodoById} = require('../controllers/todo.controllers')
const router = express.Router()

router.get("/:id", authMiddleware, getTodoById)
router.get("/", authMiddleware, getMyTodos, pagination)
router.post('/add', authMiddleware, addTodo)
router.get('/user/:id',  authMiddleware, getUserTodos, pagination)
router.delete('/delete/:id', authMiddleware, deleteTodos)
router.patch('/mark/:id', authMiddleware, markTodos)


module.exports = router