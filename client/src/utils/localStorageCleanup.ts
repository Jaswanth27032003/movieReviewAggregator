/**
 * Utility to clean up invalid localStorage values on app start
 */

export const cleanupLocalStorage = () => {
    try {
        // Check token
        const token = localStorage.getItem('token');
        if (token === 'undefined' || token === 'null' || token === '') {
            localStorage.removeItem('token');
            console.log('Cleaned up invalid token');
        }
        
        // Check user data
        try {
            const userStr = localStorage.getItem('user');
            if (userStr === 'undefined' || userStr === 'null' || userStr === '') {
                localStorage.removeItem('user');
                console.log('Cleaned up invalid user data');
            } else if (userStr) {
                // Test if it's valid JSON
                JSON.parse(userStr);
            }
        } catch (e) {
            // Invalid JSON
            localStorage.removeItem('user');
            console.log('Cleaned up corrupted user data');
        }
        
        // Clean up any review-related items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('reviews-')) {
                try {
                    const value = localStorage.getItem(key);
                    if (value === 'undefined' || value === 'null' || value === '') {
                        localStorage.removeItem(key);
                        console.log(`Cleaned up invalid data for ${key}`);
                    } else if (value) {
                        // Test if it's valid JSON
                        JSON.parse(value);
                    }
                } catch (e) {
                    // Invalid JSON
                    localStorage.removeItem(key);
                    console.log(`Cleaned up corrupted data for ${key}`);
                }
            }
        }
        
        console.log('localStorage cleanup completed');
    } catch (e) {
        console.error('Error during localStorage cleanup:', e);
    }
};

export default cleanupLocalStorage; 
