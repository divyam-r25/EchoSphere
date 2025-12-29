# EchoSphere | Social Interaction & Community System

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-HTML_CSS_JS-blue)

**EchoSphere** is a frontend-only chat simulation platform designed to explore how users interact, share, and engage in digital spaces. It simulates a live community environment with persistent data, dynamic content generation, and simulated social interactions without requiring a backend database.

## 🚀 Features

### 1. Core Social Interaction
- **Real-time Messaging:** Instant message rendering with timestamps.
- **Bot Simulation:** A "Stranger" bot (`#FF9F43`) that acts as a community member, replying with randomized, context-aware phrases after a "thinking" delay.
- **Typing Indicators:** Visual feedback ("Stranger is typing...") creates a sense of live presence.

### 2. User Engagement Systems
- **Like System:** Interactive heart button with a dynamic counter for every message.
- **Multi-Channel Communities:** Users can switch between channels (e.g., `#general`, `#tech-talk`, `#random`). Each channel maintains its own independent chat history.

### 3. User-Driven Updates (CRUD)
- **Context Menu:** Custom right-click menu tailored to the specific message clicked.
- **Edit Functionality:** Users can edit their *own* messages. Edits are marked with an `(edited)` tag and saved permanently.
- **Delete Functionality:** Users can remove messages, which updates the UI and the storage engine simultaneously.

### 4. Persistence Engine (The "Brain")
- Built with a robust `localStorage` architecture.
- **Unique IDs:** Every message is assigned a unique ID (`Date.now()`), allowing the system to track, edit, and delete specific data points accurately across page reloads.
- **Data Integrity:** Intelligent loading prevents "ghost" messages or data corruption.

---

## 🛠️ Technical Implementation

This project solves the "Social Interaction" problem statement using **Vanilla JavaScript** (No Frameworks).

### Key Concepts Demonstrated:
* **Dynamic DOM Creation:** `document.createElement()` is used to build complex message cards programmatically.
* **Event Delegation:** Efficiently handling clicks for infinite scrollable lists using parent listeners.
* **State Management:** Handling "Active Community" state and swapping data sources dynamically.
* **Asynchronous Simulation:** Using `setTimeout` to mimic network latency and human typing speed.

---

## 💻 How to Run

1.  Clone or download this repository.
2.  Open the `index.html` file in any modern web browser.
3.  **Start chatting!**
    * Try switching channels on the left sidebar.
    * Right-click your own messages to Edit or Delete.
    * Reload the page to see your data persist.

---

## 📂 Project Structure

```text
/
├── index.html       # The main structure (Sidebar + Feed)
├── style.css        # Dark theme UI, Flexbox layouts, Animations
├── script.js        # The logic core (Storage, DOM, Events)
└── README.md        # Project documentation