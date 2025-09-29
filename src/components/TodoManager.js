// src/components/TodoManager.js

import { Storage } from '../utils/storage.js';
import { API } from '../api/quoteApi.js';

export class TodoManager {
    constructor() {
        this.todos = Storage.get('todos') || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadQuote();
        this.updateUI();
    }

    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Events for Add Page (index.html)
        const addTodoBtn = document.getElementById('addTodoBtn');
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Good practice to keep, just in case.
                this.addTodo();
            });
        }

        // Events for Detail Page (detail.html)
        const todoList = document.getElementById('todoList');
        if (todoList) {
            todoList.addEventListener('click', (e) => {
                const todoItem = e.target.closest('.todo-item');
                if (!todoItem) return;
                const id = parseInt(todoItem.dataset.id, 10);

                if (e.target.classList.contains('todo-checkbox')) this.toggleTodo(id);
                if (e.target.closest('.btn-danger')) this.deleteTodo(id);
            });
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (body.classList.contains('light')) {
            body.classList.replace('light', 'dark');
            themeToggle.textContent = '☀️';
            Storage.set('theme', 'dark', true);
        } else {
            body.classList.replace('dark', 'light');
            themeToggle.textContent = '🌙';
            Storage.set('theme', 'light', true);
        }
    }

    addTodo() {
        const title = document.getElementById('todoTitle').value.trim();
        const description = document.getElementById('todoDescription').value.trim();
        
        if (!title) return;
        
        const todo = {
            id: Date.now(),
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        Storage.set('todos', this.todos);
        
        document.getElementById('todoForm').reset();
        this.showMessage('✅ Tugas berhasil ditambahkan!', 'success');
        
        // Redirect to detail page after adding
        setTimeout(() => {
            window.location.href = 'detail.html';
        }, 1000);
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>Belum ada tugas</h3>
                    <p>Mulai dengan menambahkan tugas pertama Anda!</p>
                </div>
            `;
        } else {
            todoList.innerHTML = this.todos.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="todo-content">
                        <div class="todo-title">${this.escapeHtml(todo.title)}</div>
                        ${todo.description ? `<div class="todo-description">${this.escapeHtml(todo.description)}</div>` : ''}
                        <div class="todo-date">📅 ${new Date(todo.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-small btn-danger">
                            🗑️ Hapus
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        this.updateStats();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            Storage.set('todos', this.todos);
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        if (confirm('Yakin ingin menghapus tugas ini?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            Storage.set('todos', this.todos);
            this.renderTodos();
            this.showMessage('🗑️ Tugas berhasil dihapus!', 'info');
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        
        const totalEl = document.getElementById('totalTodos');
        if (totalEl) {
            totalEl.textContent = total;
            document.getElementById('completedTodos').textContent = completed;
            document.getElementById('pendingTodos').textContent = pending;
        }
    }
    
    async loadQuote() {
        const quoteContent = document.getElementById('quoteContent');
        try {
            const quote = await API.getRandomQuote();
            quoteContent.innerHTML = `
                <div class="quote-text">"${quote.content}"</div>
                <div class="quote-author">— ${quote.author}</div>
                ${quote.error ? '<div style="font-size: 0.8rem; margin-top: 10px; opacity: 0.6;">* Quote offline</div>' : ''}
            `;
        } catch (error) {
            quoteContent.innerHTML = `
                <div class="quote-text error">"Mulailah dari mana Anda berada. Gunakan apa yang Anda miliki. Lakukan apa yang Anda bisa."</div>
                <div class="quote-author">— Arthur Ashe</div>
            `;
        }
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    updateUI() {
        const savedTheme = Storage.get('theme', true) || 'light';
        document.body.className = savedTheme;
        document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        Storage.set('lastVisited', new Date().toISOString(), true);

        // Render todos if we are on the detail page
        if (document.getElementById('todoListSection')) {
            this.renderTodos();
        }
    }
}