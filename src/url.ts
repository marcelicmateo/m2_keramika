/** Hand-written internal URL, prefixed with the configured base path. */
export const url = (path = '') => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\//, '');
