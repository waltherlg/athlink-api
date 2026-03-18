export const accountsPaths = {
  registration: {
    controller: 'registration',
  },
  authorization: {
    controller: 'auth',
    login: 'login',
    me: 'me',
  },
} as const;
