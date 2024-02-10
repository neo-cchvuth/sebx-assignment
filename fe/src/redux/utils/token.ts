const TOKEN_KEY = 'tk';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  return localStorage.removeItem(TOKEN_KEY);
};
