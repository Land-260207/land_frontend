const api = (url: string, options: any = {}) => {
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  });
};

export default api;