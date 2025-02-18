export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('usertoken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch');
    }

    return response.json();
}; 