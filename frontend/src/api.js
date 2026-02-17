const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getHeaders(token, hasJsonBody = true) {
  const headers = {};
  if (hasJsonBody) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let message = 'Error inesperado en la petición';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/products${query}`);
}

export function getProductById(productId) {
  return request(`/products/${productId}`);
}

export function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials)
  });
}

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
}

export function createProduct(product, token) {
  return request('/products', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(product)
  });
}

export function updateProduct(productId, product, token) {
  return request(`/products/${productId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(product)
  });
}

export function deleteProduct(productId, token) {
  return request(`/products/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(token, false)
  });
}
