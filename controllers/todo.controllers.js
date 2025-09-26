const { readDatabase, writeDatabse } = require("../utils/dbOps");

function addTodo(req, res) {
  const user = req.user;
  const { title, description, dueDate } = req.body;
  if (!title || !description || !dueDate) {
    return res.status(400).json({
      status: false,
      message: "All fileds are required",
    });
  }

  const db = readDatabase();
  const todos = db["todos"];
  const newTodo = {
    todo_id: db["todo_id_autoIncrement"],
    user_id: user.user_id,
    title,
    description,
    created_at: Date.now(),
    dueDate,
    status: "pending",
  };

  todos.push(newTodo);
  db["todo_id_autoIncrement"] += 1;
  writeDatabse(db);
  return res.status(201).json({
    status: true,
    message: "Todo created succesfully",
  });
}

function getUserTodos(req, res, next) {
  const { id } = req.params;
  const db = readDatabase();
  const user = db["todos"].some(todo => todo.user_id == id);

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "No todos found for this user",
    });
  }
  const user_todos = db["todos"].filter(todo => todo.user_id == id);
  req.user_todos = user_todos;
  next();
}

function deleteTodos(req, res) {
  const user = req.user;
  const { id } = req.params;

  const db = readDatabase();
  const todos = db["todos"];
  const index = todos.findIndex(
    todo => todo.todo_id == id && todo.user_id == user.user_id
  );
  if (index === -1) {
    return res.status(404).json({
      status: false,
      message: "You don't have a todo with this ID",
    });
  }

  todos.splice(index, 1);
  writeDatabse(db);
  return res.status(204).end();
}

// this get todos based on whether a query string was passed or not. If no query string, all todos is fetched. If query string, todo is fetched based on that query string
function getMyTodos(req, res, next) {
  const user = req.user;
  const db = readDatabase();
  const { status, title, description, past_date } = req.query;
  let user_todos = db["todos"].filter(todo => todo.user_id == user.user_id);

  if (user_todos.length == 0) {
    return res.status(404).json({
      status: false,
      message: "You don't any todos",
    });
  }

  if (status) {
    user_todos = user_todos.filter(todo => todo.status == status.toLowerCase());

    if (user_todos.length === 0) {
      return res.status(404).json({
        status: false,
        message: `You don't have any ${status} todo`,
      });
    }
  }

  if (title || description) {
    const searchTitle = (title || "").toLowerCase();
    const searchDescription = (description || "").toLowerCase();
    user_todos = user_todos.filter(
      todo =>
        todo.title.toLowerCase().includes(searchTitle) ||
        todo.description.toLowerCase().includes(searchDescription)
    );
    if (user_todos.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No result for this search`,
      });
    }
  }

  if (past_date) {
    user_todos = user_todos.filter(
      todo => todo.created_at < new Date(date).getTime()
    );

    if (user_todos.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No todo found",
      });
    }
  }

  req.user_todos = user_todos;
  next();
}

function getTodoById(req, res){
  const user = req.user
  const {id} = req.params
  const db = readDatabase();
  const user_todo = db["todos"].find(todo => todo.user_id == user.user_id && todo.todo_id == id);

  if (!user_todo) {
    return res.status(404).json({
      status: false,
      message: "No todos with this ID found",
    });
  }
   return res.status(200).json({
      status: true,
      message: "Todo retrieved successfully",
      todo: user_todo
    });

}

function pagination(req, res) {
  const { page } = req.query;
  const user_todos = req.user_todos;
  const limit = 10;
  const totalPages = Math.ceil(user_todos.length / limit);

  if (!page) {
    return res.status(200).json({
      status: true,
      message: "Todos retrieved successfully",
      totalPages,
      itemsPerPage: 10,
      all: user_todos.length,
      todo: user_todos,
    });
  }

  const pageNumber = +page;
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    return res.status(404).json({
      status: false,
      message: "The page you are looking for does not exist",
    });
  }

  const start = (pageNumber - 1) * limit;
  const end = pageNumber * limit;

  const pageTodo = user_todos.slice(start, end);
  console.log(pageTodo.length);
  return res.status(200).json({
    status: true,
    message: "Todos retrieved successfully",
    page: pageNumber,
    totalPages,
    itemsPerPage: 10,
    all: user_todos.length,
    todo: pageTodo,
  });
}

// This marks todo as completed or pending. if pending becomes completed, if completed becones pending
function markTodos(req, res) {
  const { id } = req.params;
  const user = req.user;
  const db = readDatabase();
  const todos = db["todos"];
  const todoToComplete = todos.find(
    todo => todo.todo_id == id && todo.user_id == user.user_id
  );
  if (!todoToComplete) {
    return res.status(404).json({
      status: false,
      message: "You don't have a todo with this ID",
    });
  }
  todoToComplete.status =
    todoToComplete.status == "pending" ? "completed" : "pending";
  writeDatabse(db);
  return res.status(200).json({
    status: true,
    message: "Todo completed",
    todo: todoToComplete,
  });
}

module.exports = {
  addTodo,
  getUserTodos,
  deleteTodos,
  getMyTodos,
  markTodos,
  getTodoById,
  pagination,
};
