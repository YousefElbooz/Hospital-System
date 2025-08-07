import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;

  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === 'admin';
  } catch (e) {
    return false;
  }
};
