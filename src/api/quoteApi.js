export const API = {
            async getRandomQuote() {
                try {
                    const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=200');
                    if (!response.ok) throw new Error('Network response was not ok');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching quote:', error);
                    return {
                        content: "With great power comes great responsibility.",
                        author: "Uncle Ben",
                        error: true
                    };
                }
            }
        };