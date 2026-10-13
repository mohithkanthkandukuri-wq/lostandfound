/**
 * Spring Boot REST API Client
 * Compatible with backend exposed on port 8080.
 * In prototype/demo mode, graceful fallbacks allow full interactive offline operation.
 */

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const BASE_URL = configuredBaseUrl || 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('campus_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const checkBackendHealth = async () => {
  if (!configuredBaseUrl && import.meta.env.PROD) return false;

  try {
    const res = await fetch(`${BASE_URL}/items/recent`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const api = {
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) throw new Error((await res.json())?.message || 'Login failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('campus_jwt_token', data.token);
      return data;
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error((await res.json())?.message || 'Registration failed');
      return await res.json();
    },
    logout: async () => {
      localStorage.removeItem('campus_jwt_token');
      try {
        await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: getHeaders() });
      } catch {
        // Safe ignore
      }
    }
  },

  users: {
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/users/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return await res.json();
    },
    updateMe: async (profile) => {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    }
  },

  items: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/items?${query}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch items');
      return await res.json();
    },
    getRecent: async () => {
      const res = await fetch(`${BASE_URL}/items/recent`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch recent items');
      return await res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/items/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Item not found');
      return await res.json();
    },
    getMy: async (page = 0, size = 10) => {
      const res = await fetch(`${BASE_URL}/items/my?page=${page}&size=${size}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch my items');
      return await res.json();
    },
    create: async (itemData) => {
      const res = await fetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemData)
      });
      if (!res.ok) throw new Error('Failed to create item');
      return await res.json();
    },
    update: async (id, itemData) => {
      const res = await fetch(`${BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(itemData)
      });
      if (!res.ok) throw new Error('Failed to update item');
      return await res.json();
    },
    markReturned: async (id) => {
      const res = await fetch(`${BASE_URL}/items/${id}/return`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to mark item returned');
      return await res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/items/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return true;
    }
  },

  claims: {
    submit: async (itemId, message) => {
      const res = await fetch(`${BASE_URL}/items/${itemId}/claims`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Failed to submit claim');
      return await res.json();
    },
    getMy: async () => {
      const res = await fetch(`${BASE_URL}/claims/my`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch my claims');
      return await res.json();
    },
    approve: async (id, reviewMessage) => {
      const res = await fetch(`${BASE_URL}/claims/${id}/approve`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ reviewMessage })
      });
      if (!res.ok) throw new Error('Failed to approve claim');
      return await res.json();
    },
    reject: async (id, reviewMessage) => {
      const res = await fetch(`${BASE_URL}/claims/${id}/reject`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ reviewMessage })
      });
      if (!res.ok) throw new Error('Failed to reject claim');
      return await res.json();
    },
    cancel: async (id) => {
      const res = await fetch(`${BASE_URL}/claims/${id}/cancel`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to cancel claim');
      return await res.json();
    }
  },

  notifications: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    },
    getUnreadCount: async () => {
      const res = await fetch(`${BASE_URL}/notifications/unread-count`, { headers: getHeaders() });
      if (!res.ok) return 0;
      return await res.json();
    },
    markRead: async (id) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      return res.ok;
    }
  }
};
