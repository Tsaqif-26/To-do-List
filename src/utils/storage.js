// src/utils/storage.js

export const Storage = {
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