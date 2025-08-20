# Animated Todo Dashboard

A premium animated task management web app built with HTML, CSS, and JavaScript. No backend or database required. Inspired by modern task dashboards on Dribbble, it features gradients, animations, drag-and-drop, subtasks, and gamification elements.

---

## Features

- Animated gradient task cards
- Smooth drag-and-drop with spring animations
- Subtasks with completion
- Confetti animation on task completion
- Dark/Light mode toggle with neon accents
- Streak/badge gamification
- Tags, priorities, due dates, and repeat options
- Search and filter tasks
- Export/Import tasks as JSON
- Responsive design with hover effects
- Optional emoji/icons per task

---

## Usage

1. Open the `index.html` file in any modern browser.
2. Click "+ Add Task" to create a new task.
3. Use the search box to filter tasks.
4. Drag tasks around to reorder them.
5. Click "✅ Complete Task" to remove a task and trigger confetti.
6. Export your tasks via "📤 Export JSON", import via "📥 Import JSON".
7. Toggle Dark/Light mode with the moon/sun button.

---

## File Structure

animated-todo-dashboard/
│
├── index.html       # Main HTML page
├── styles.css       # CSS styling, gradients & animations
├── script.js        # JS logic: task CRUD, drag-drop, confetti
└── README.md        # Project documentation

---

## How to Run

1. Download the repository manually or clone it.
2. Open `index.html` in any browser — no server or Node.js required.

> Optional: For a live web version, enable GitHub Pages in your repository settings.

---

## Libraries Used

- GSAP (https://greensock.com/gsap/) – smooth animations, drag-and-drop spring effects
- Canvas Confetti (https://www.kirilv.com/canvas-confetti/) – confetti on task completion

---

## Contribution

- Fork the repository to add features such as:
  - Background particle effects
  - Advanced recurring tasks
  - Mobile-specific enhancements
