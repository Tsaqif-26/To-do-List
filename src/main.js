// src/main.js
import { TodoManager } from './components/TodoManager.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoManager();
});