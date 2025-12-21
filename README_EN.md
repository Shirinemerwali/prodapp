# 📋 Productivity Assistant – Your Everyday Companion

## 🧠 About the Project

**Productivity Assistant** is a web application designed to help you organize your day, build habits, and manage events—all in one place. It’s not just a task manager; it’s a tool to help you focus on what matters most, reduce stress, and make your routines stick.

Developed over two agile sprints, the app revolves around three core pillars:

* **Todos** – Track your tasks and get things done
* **Habits** – Build and maintain meaningful routines
* **Events** – Keep track of important dates and appointments

The dashboard gives you a snapshot of your day, highlighting the most urgent tasks, your top habits, upcoming events, and even a motivational quote to start your day on the right note.

---

## 🚀 Features

### 🧭 Dashboard

* Quickly see your **3 most urgent todos**
* Track the **3 habits you’ve repeated the most**
* Stay on top of your **3 upcoming events**
* Get a **daily motivational quote**

### ✅ Todos

* Add, edit, and remove tasks easily
* Mark tasks as complete
* Organize with categories, deadlines, and time estimates
* Filter and sort tasks to focus on what matters

### 🔁 Habits

* Create and delete habits effortlessly
* Track repetitions: increase, decrease, or reset
* Prioritize habits with low, medium, or high importance
* Filter and sort to focus on your most impactful habits

### 📅 Events

* Manage events with create, edit, and delete options
* Events are always sorted by the next upcoming date
* Filter to see **upcoming** or **past events**

---

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Shirinemerwali/prodapp
```

2. Install dependencies:

```bash
npm install
```

3. Start the app in two terminals:

**Terminal 1 – Frontend:**

```bash
npm run dev
```

**Terminal 2 – Backend:**

```bash
node server/index.js
```

4. Open your browser: `http://localhost:5173`

> The frontend runs on **Vite** and the backend uses a simple **Express server** to manage data locally.

---

## 🧑‍🤝‍🧑 Team & Workflow

This project was created by three passionate developers, each contributing to both frontend, backend, and testing:

* **Shirin** – Frontend (Todos, Habits, Events), UI logic, component structure
* **Lily** – Backend (Express, database management) + frontend
* **Aisha** – Dashboard, UI design, and some backend functionality

We followed an **agile workflow**, including short standups, sprint retrospectives, and task management through Trello. Features were reviewed and tested by other team members before merging, ensuring smooth functionality and high quality.

---

## 🧪 Testing

Testing was a team effort: each feature was verified by a team member other than the one who built it. Pull requests were only merged once the functionality was confirmed to work flawlessly. This process ensured that the final product was reliable, consistent, and user-friendly.