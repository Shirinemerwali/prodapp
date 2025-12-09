import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Todos() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState("");
  const [category, setCategory] = useState("health");
  const [deadline, setDeadline] = useState("");
  const [editingId, setEditingId] = useState(null);

  function addTodo() {
    if (!text.trim()) return;

    if (editingId) {
      // EDIT MODE
      setTodos(
        todos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                title: text,
                description: description,
                estimate: estimate,
                category: category,
                deadline: deadline,
              }
            : todo
        )
      );
      setEditingId(null);
    } else {
      // CREATE NEW TODO
      const newTodo = {
        id: uuidv4(),
        title: text,
        description: description,
        estimate: estimate,
        category: category,
        deadline: deadline,
        completed: false,
      };

      setTodos([...todos, newTodo]);
    }

    // RESET FIELDS
    setText("");
    setDescription("");
    setEstimate("");
    setCategory("health");
    setDeadline("");
  }

  function toggleCompleted(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function startEditing(id) {
    const todo = todos.find((t) => t.id === id);
    setEditingId(id);
    setText(todo.title);
    setDescription(todo.description);
    setEstimate(todo.estimate);
    setCategory(todo.category);
    setDeadline(todo.deadline);
  }

  return (
    <div className="todos-page">

      <div className="todo-input-section">
        <input
          type="text"
          value={text}
          placeholder="Title"
          onChange={(e) => setText(e.target.value)}
          className="todo-input"
        />

        <textarea
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
        />

        <input
          type="number"
          value={estimate}
          placeholder="Time estimate (minutes)"
          onChange={(e) => setEstimate(e.target.value)}
          className="todo-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="todo-input"
        >
          <option value="health">Health</option>
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="fun">Fun</option>
        </select>

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="todo-input"
        />

        <button onClick={addTodo} className="todo-add-btn">
          {editingId ? "Save changes" : "Add todo"}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">

            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo.id)}
            />

            <strong
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </strong>
            <br />

            {todo.description} <br />
            Time estimate: {todo.estimate} minutes <br />
            Category: {todo.category} <br />
            Deadline: {todo.deadline}
            <br />

            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>

            <button onClick={() => startEditing(todo.id)}>
              Edit
            </button>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default Todos;

