export const API_BASE = 'http://localhost:8082/api/v1/sneakerx';

const friendlyFetch = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
  }
};

export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('sneakerx_sessionId');
  if (!sessionId) {
    sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('sneakerx_sessionId', sessionId);
  }
  return sessionId;
}

export function getSessionId() {
  return localStorage.getItem('sneakerx_sessionId');
}

export function clearSessionId() {
  localStorage.removeItem('sneakerx_sessionId');
}

const getAuthHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = localStorage.getItem('sneakerx_jwt');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const userId = localStorage.getItem('sneakerx_userId');
  if (userId) headers['X-User-Id'] = String(userId);
  return headers;
};

const getSessionHeaders = (sessionId, extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  headers['X-Session-Id'] = sessionId || getOrCreateSessionId();
  return headers;
};

const parseResponse = async (response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
};

const STATUS_MESSAGES = {
  400: 'Los datos enviados no son válidos. Revisa el formulario.',
  401: 'Usuario o contraseña incorrectos.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
  409: 'El usuario o correo ya está registrado.',
  500: 'Error del servidor. Inténtalo más tarde.',
  503: 'El servicio no está disponible. Inténtalo más tarde.',
};

const ensureOk = async (response) => {
  if (response.ok) return response;
  let message = STATUS_MESSAGES[response.status] || `Error ${response.status}`;
  try {
    const data = await response.clone().json();
    if (data?.message) message = data.message;
    else if (data?.error) message = data.error;
  } catch {}
  throw new Error(message);
};

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.items)) return data.items;
  return data;
};

export const authService = {
  register: async (userData) => {
    const response = await friendlyFetch(`${API_BASE}/user/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  login: async (username, password) => {
    const response = await friendlyFetch(`${API_BASE}/user/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    await ensureOk(response);
    const data = await parseResponse(response);
    const usuario = data?.usuario || data?.user || null;
    const token = data?.token || data?.accessToken || null;
    if (token) localStorage.setItem('sneakerx_jwt', token);
    const userId = usuario?.id ?? data?.userId ?? data?.id ?? null;
    if (userId != null) localStorage.setItem('sneakerx_userId', String(userId));
    const uname = usuario?.username ?? data?.username ?? username;
    if (uname) localStorage.setItem('sneakerx_username', uname);
    const role = usuario?.role ?? data?.role ?? null;
    if (role) localStorage.setItem('sneakerx_role', role);
    if (usuario) localStorage.setItem('sneakerx_user', JSON.stringify(usuario));
    return data;
  },
  getProfile: async () => {
    const response = await friendlyFetch(`${API_BASE}/user/usuarios/me`, {
      headers: getAuthHeaders(),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  updateProfile: async (userData) => {
    const response = await friendlyFetch(`${API_BASE}/user/usuarios/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
};

export const productService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.category) params.append('categoria', filters.category);
    if (filters.name) params.append('nombre', filters.name);
    if (filters.page != null) params.append('page', filters.page);
    if (filters.size != null) params.append('size', filters.size);
    const url = `${API_BASE}/producto/productos${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await friendlyFetch(url);
    await ensureOk(response);
    const data = await parseResponse(response);
    return toArray(data);
  },
  getById: async (id) => {
    const response = await friendlyFetch(`${API_BASE}/producto/productos/${id}`);
    await ensureOk(response);
    return parseResponse(response);
  },
  getPage: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.category) params.append('categoria', filters.category);
    if (filters.name) params.append('nombre', filters.name);
    if (filters.page != null) params.append('page', filters.page);
    if (filters.size != null) params.append('size', filters.size);
    const url = `${API_BASE}/producto/productos${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await friendlyFetch(url);
    await ensureOk(response);
    const data = await parseResponse(response);
    return {
      content: toArray(data),
      totalPages: data?.totalPages ?? 1,
      totalElements: data?.totalElements ?? (Array.isArray(data) ? data.length : (data?.content?.length ?? 0)),
      number: data?.number ?? (filters.page ?? 0),
    };
  },
  create: async (productData) => {
    const response = await friendlyFetch(`${API_BASE}/producto/admin/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  update: async (id, productData) => {
    const response = await friendlyFetch(`${API_BASE}/producto/admin/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  remove: async (id) => {
    const response = await friendlyFetch(`${API_BASE}/producto/admin/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
};

export const cartService = {
  getCart: async (userId) => {
    const uid = userId ?? localStorage.getItem('sneakerx_userId');
    const headers = { 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito`, { headers });
    await ensureOk(response);
    return parseResponse(response);
  },
  addToCart: async (userId, productoId, cantidad, talla) => {
    let uid = userId;
    let pid = productoId;
    let qty = cantidad;
    if (typeof userId === 'object' && userId !== null) {
      const obj = userId;
      uid = obj.userId ?? obj.user_id ?? localStorage.getItem('sneakerx_userId');
      pid = obj.productoId ?? obj.productId ?? obj.id;
      qty = obj.cantidad ?? obj.quantity ?? 1;
      talla = obj.talla ?? obj.size ?? talla;
    }
    const headers = { 'Content-Type': 'application/json', 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito/items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productoId: pid, cantidad: qty, talla: talla ?? null }),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  updateCartItem: async (userId, itemId, cantidad) => {
    let uid = userId;
    let id = itemId;
    let qty = cantidad;
    if (typeof userId === 'object' && userId !== null) {
      const obj = userId;
      uid = obj.userId ?? obj.user_id ?? localStorage.getItem('sneakerx_userId');
      id = obj.itemId ?? obj.id;
      qty = obj.cantidad ?? obj.quantity;
    }
    const headers = { 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito/items/${id}?cantidad=${qty}`, {
      method: 'PUT',
      headers,
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  removeCartItem: async (userId, itemId) => {
    let uid = userId;
    let id = itemId;
    if (typeof userId === 'object' && userId !== null) {
      const obj = userId;
      uid = obj.userId ?? obj.user_id ?? localStorage.getItem('sneakerx_userId');
      id = obj.itemId ?? obj.id;
    }
    const headers = { 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito/items/${id}`, {
      method: 'DELETE',
      headers,
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  clearCart: async (userId) => {
    const uid = userId ?? localStorage.getItem('sneakerx_userId');
    const headers = { 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito`, {
      method: 'DELETE',
      headers,
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  getGuestCart: async (sessionId) => {
    const sid = sessionId || getOrCreateSessionId();
    const response = await friendlyFetch(`${API_BASE}/carrito/sesion`, {
      headers: getSessionHeaders(sid),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  addToGuestCart: async (sessionId, productoId, cantidad, talla) => {
    let sid = sessionId;
    let pid = productoId;
    let qty = cantidad;
    if (typeof sessionId === 'object' && sessionId !== null) {
      const obj = sessionId;
      sid = obj.sessionId || getOrCreateSessionId();
      pid = obj.productoId ?? obj.productId ?? obj.id;
      qty = obj.cantidad ?? obj.quantity ?? 1;
      talla = obj.talla ?? obj.size ?? talla;
    }
    sid = sid || getOrCreateSessionId();
    const response = await friendlyFetch(`${API_BASE}/carrito/sesion/items`, {
      method: 'POST',
      headers: getSessionHeaders(sid),
      body: JSON.stringify({ productoId: pid, cantidad: qty, talla: talla ?? null }),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  updateGuestCartItem: async (sessionId, itemId, cantidad) => {
    let sid = sessionId;
    let id = itemId;
    let qty = cantidad;
    if (typeof sessionId === 'object' && sessionId !== null) {
      const obj = sessionId;
      sid = obj.sessionId || getOrCreateSessionId();
      id = obj.itemId ?? obj.id;
      qty = obj.cantidad ?? obj.quantity;
    }
    sid = sid || getOrCreateSessionId();
    const response = await friendlyFetch(`${API_BASE}/carrito/sesion/items/${id}?cantidad=${qty}`, {
      method: 'PUT',
      headers: getSessionHeaders(sid),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  removeGuestCartItem: async (sessionId, itemId) => {
    let sid = sessionId;
    let id = itemId;
    if (typeof sessionId === 'object' && sessionId !== null) {
      const obj = sessionId;
      sid = obj.sessionId || getOrCreateSessionId();
      id = obj.itemId ?? obj.id;
    }
    sid = sid || getOrCreateSessionId();
    const response = await friendlyFetch(`${API_BASE}/carrito/sesion/items/${id}`, {
      method: 'DELETE',
      headers: getSessionHeaders(sid),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  clearGuestCart: async (sessionId) => {
    const sid = sessionId || getOrCreateSessionId();
    const response = await friendlyFetch(`${API_BASE}/carrito/sesion`, {
      method: 'DELETE',
      headers: getSessionHeaders(sid),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  transferCart: async (sessionId, userId) => {
    let sid = sessionId;
    let uid = userId;
    if (typeof sessionId === 'object' && sessionId !== null) {
      const obj = sessionId;
      sid = obj.sessionId || getSessionId() || getOrCreateSessionId();
      uid = obj.userId ?? obj.user_id ?? localStorage.getItem('sneakerx_userId');
    }
    sid = sid || getSessionId() || getOrCreateSessionId();
    uid = uid ?? localStorage.getItem('sneakerx_userId');
    const headers = { 'X-Session-Id': String(sid), 'X-User-Id': String(uid) };
    const token = localStorage.getItem('sneakerx_jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await friendlyFetch(`${API_BASE}/carrito/transferir`, {
      method: 'POST',
      headers,
    });
    await ensureOk(response);
    const cart = await parseResponse(response);
    clearSessionId();
    return cart;
  },
};

export const adminService = {
  listUsers: async () => {
    const response = await friendlyFetch(`${API_BASE}/user/admin/usuarios`, {
      headers: getAuthHeaders(),
    });
    await ensureOk(response);
    const data = await parseResponse(response);
    return toArray(data);
  },
  updateUser: async (id, data) => {
    const response = await friendlyFetch(`${API_BASE}/user/admin/usuarios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  deleteUser: async (id) => {
    const response = await friendlyFetch(`${API_BASE}/user/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await ensureOk(response);
    return parseResponse(response);
  },
  createUser: async ({ username, password, email, role, phone, address, comuna }) => {
    const reg = await authService.register({ username, password, email, phone, address, comuna });
    const usuario = reg?.usuario || reg?.user || reg;
    if ((role === 'ADMIN' || role === 'Administrador') && usuario?.id) {
      await adminService.updateUser(usuario.id, { email, phone, address, comuna, role: 'ADMIN' });
    }
    return usuario;
  },
};

export const getProducts = (filters) => productService.getAll(filters);
export const getProduct = (id) => productService.getById(id);

export default {
  API_BASE,
  authService,
  productService,
  cartService,
  adminService,
  getOrCreateSessionId,
  getSessionId,
  clearSessionId,
};
