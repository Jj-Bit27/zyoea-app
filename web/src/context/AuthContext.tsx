import { atom, map } from 'nanostores';
import { useStore } from '@nanostores/react';
import { addToast } from '../components/custom/Toast';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin' | 'employee' | 'client';
  avatar?: string;
}

// --- 1. Estado Global ---
// Guardamos el usuario en un átomo. Inicialmente null.
export const $user = atom<User | null>(null);

// --- 2. Inicialización (Persistencia) ---
// Este código se ejecutará en el cliente para recuperar la sesión
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('foodapp_user');
  if (storedUser) {
    try {
      $user.set(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing user data", e);
      localStorage.removeItem('foodapp_user');
    }
  }
}

// --- 3. Acciones de Autenticación ---

export const login = async (email: string, password: string) => {
  // SIMULACIÓN DE API
  // Aquí harías tu fetch('/api/auth/login', ...)
  
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // Simulación de credenciales (Hardcoded para demo)
      if (email === 'admin@foodapp.com' && password === 'admin123') {
        const user: User = { id: '1', name: 'Super Admin', email, role: 'superadmin' };
        $user.set(user);
        localStorage.setItem('foodapp_user', JSON.stringify(user));
        addToast(`Bienvenido de nuevo, ${user.name}`, 'success');
        resolve();
      } else if (email === 'staff@foodapp.com' && password === 'staff123') {
        const user: User = { id: '2', name: 'Carlos Staff', email, role: 'admin' }; // Dueño restaurante
        $user.set(user);
        localStorage.setItem('foodapp_user', JSON.stringify(user));
        addToast(`Hola ${user.name}`, 'success');
        resolve();
      } else if (email === 'cliente@foodapp.com' && password === '123456') {
        const user: User = { id: '3', name: 'Juan Cliente', email, role: 'client' };
        $user.set(user);
        localStorage.setItem('foodapp_user', JSON.stringify(user));
        addToast(`Bienvenido ${user.name}`, 'success');
        resolve();
      } else {
        addToast('Credenciales incorrectas', 'error');
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
};

export const register = async (name: string, email: string, password: string) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // Simular registro exitoso
      const user: User = { id: Date.now().toString(), name, email, role: 'client' };
      $user.set(user);
      localStorage.setItem('foodapp_user', JSON.stringify(user));
      addToast('Cuenta creada exitosamente', 'success');
      resolve();
    }, 1000);
  });
};

export const logout = () => {
  $user.set(null);
  localStorage.removeItem('foodapp_user');
  addToast('Sesión cerrada', 'info');
  // Redirigir al home o login
  window.location.href = '/login';
};

// --- 4. Hook de Compatibilidad para React ---
// Esto permite que tus componentes existentes usen useAuth() sin muchos cambios
export function useAuth() {
  const user = useStore($user);
  return { user, login, register, logout };
}