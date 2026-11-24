export const readingTime = (content = '') => Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
export const blogDate = (value) => value ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + 'T12:00:00')) : '';
