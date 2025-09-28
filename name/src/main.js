
  // Storage utility functions
        const Storage = {
            get: (key, isSession = false) => {
                const storage = isSession ? sessionStorage : localStorage;
                try {
                    const item = storage.getItem(key);
                    return item ? JSON.parse(item) : null;
                } catch (e) {
                    console.error('Error parsing storage item:', e);
                    return null;
                }
            },
            
            set: (key, value, isSession = false) => {
                const storage = isSession ? sessionStorage : localStorage;
                try {
                    storage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error('Error saving to storage:', e);
                    return false;
                }
            },
            
            remove: (key, isSession = false) => {
                const storage = isSession ? sessionStorage : localStorage;
                storage.removeItem(key);
            }
        };

        // API functions
        const API = {
            async getRandomQuote() {
                try {
                    const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=200');
                    if (!response.ok) throw new Error('Network response was not ok');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching quote:', error);
                    return {
                        content: "Kebahagiaan bukanlah sesuatu yang sudah jadi. Kebahagiaan datang dari tindakan Anda sendiri.",
                        author: "Dalai Lama",
                        error: true
                    };
                }
            }
        };

        // Todo management
        class TodoManager {
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
                document.getElementById('themeToggle').addEventListener('click', this.toggleTheme);
                
                // Navigation
                document.getElementById('showAddForm').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAddForm();
                });
                
                document.getElementById('showTodoList').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showTodoList();
                });
                
                // Form submission
                document.getElementById('todoForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTodo();
                });
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

            showAddForm() {
                document.getElementById('addTodoSection').style.display = 'block';
                document.getElementById('todoListSection').style.display = 'none';
            }

            showTodoList() {
                document.getElementById('addTodoSection').style.display = 'none';
                document.getElementById('todoListSection').style.display = 'block';
                this.renderTodos();
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
                
                // Reset form
                document.getElementById('todoForm').reset();
                
                // Show success message
                this.showMessage('✅ Tugas berhasil ditambahkan!', 'success');
                
                // Auto show todo list
                setTimeout(() => this.showTodoList(), 1000);
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
                    this.updateStats();
                    return;
                }
                
                todoList.innerHTML = this.todos.map(todo => `
                    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                               onchange="todoManager.toggleTodo(${todo.id})">
                        <div class="todo-content">
                            <div class="todo-title">${this.escapeHtml(todo.title)}</div>
                            ${todo.description ? `<div class="todo-description">${this.escapeHtml(todo.description)}</div>` : ''}
                            <div class="todo-date">📅 ${new Date(todo.createdAt).toLocaleDateString('id-ID')}</div>
                        </div>
                        <div class="todo-actions">
                            <button class="btn btn-small btn-danger" onclick="todoManager.deleteTodo(${todo.id})">
                                🗑️ Hapus
                            </button>
                        </div>
                    </div>
                `).join('');
                
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
                
                document.getElementById('totalTodos').textContent = total;
                document.getElementById('completedTodos').textContent = completed;
                document.getElementById('pendingTodos').textContent = pending;
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
                        <div class="quote-text error">
                            "Mulailah dari mana Anda berada. Gunakan apa yang Anda miliki. Lakukan apa yang Anda bisa."
                        </div>
                        <div class="quote-author">— Arthur Ashe</div>
                    `;
                }
            }

            showMessage(message, type = 'info') {
                const messageEl = document.createElement('div');
                messageEl.className = `message ${type}`;
                messageEl.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary-color)'};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1001;
                    animation: fadeIn 0.3s ease-out;
                `;
                messageEl.textContent = message;
                
                document.body.appendChild(messageEl);
                
                setTimeout(() => {
                    messageEl.style.opacity = '0';
                    messageEl.style.transform = 'translateX(100%)';
                    setTimeout(() => messageEl.remove(), 300);
                }, 3000);
            }

            escapeHtml(text) {
                const map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return text.replace(/[&<>"']/g, m => map[m]);
            }

            updateUI() {
                // Load theme preference
                const savedTheme = Storage.get('theme', true) || 'light';
                document.body.className = savedTheme;
                document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
                
                // Save last visited
                Storage.set('lastVisited', new Date().toISOString(), true);
                
                // Show initial section
                this.showAddForm();
            }
        }

        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            window.todoManager = new TodoManager();
        });