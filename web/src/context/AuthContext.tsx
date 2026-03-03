import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { gql } from '@apollo/client';
import { getApolloClient } from '../libs/apollo';
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

// --- GraphQL Mutations ---
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        name
        email
        role
      }
      restaurant
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        name
        email
        role
      }
    }
  }
`;

// --- 3. Acciones de Autenticación ---

export const login = async (email: string, password: string) => {
  const client = getApolloClient();
  const result = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: { input: { email, password } },
  });

  const { accessToken, user, restaurant } = result.data.login;
  const mappedUser: User = {
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role as User['role'],
  };
  $user.set(mappedUser);
  localStorage.setItem('foodapp_user', JSON.stringify(mappedUser));
  localStorage.setItem('foodapp_token', accessToken);
  if (restaurant) {
    localStorage.setItem('foodapp_restaurant', String(restaurant));
  }
  addToast(`Bienvenido de nuevo, ${mappedUser.name}`, 'success');
};

export const register = async (name: string, email: string, password: string) => {
  const client = getApolloClient();
  const result = await client.mutate({
    mutation: REGISTER_MUTATION,
    variables: { input: { name, email, password, role: 'client' } },
  });

  const { accessToken, user } = result.data.register;
  const mappedUser: User = {
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role as User['role'],
  };
  $user.set(mappedUser);
  localStorage.setItem('foodapp_user', JSON.stringify(mappedUser));
  localStorage.setItem('foodapp_token', accessToken);
  addToast('Cuenta creada exitosamente', 'success');
};

export const logout = () => {
  $user.set(null);
  localStorage.removeItem('foodapp_user');
  localStorage.removeItem('foodapp_token');
  localStorage.removeItem('foodapp_restaurant');
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