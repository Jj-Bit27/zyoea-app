import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";
import { $user } from "../context/AuthContext";

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

export function useAuthMutations() {
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
    onError: (err) => addToast(err.message, "error"),
  });

  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION, {
    onError: (err) => addToast(err.message, "error"),
  });

  const loginWithGraphQL = async (email: string, password: string) => {
    const result = await loginMutation({
      variables: { input: { email, password } },
    });

    if (result.data?.login) {
      const { accessToken, user, restaurant } = result.data.login;
      const mappedUser = {
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role as "admin" | "superadmin" | "employee" | "client",
        restaurantId: restaurant?.toString(),
      };
      $user.set(mappedUser);
      localStorage.setItem("foodapp_user", JSON.stringify(mappedUser));
      localStorage.setItem("foodapp_token", accessToken);
      addToast(`Bienvenido de nuevo, ${user.name}`, "success");
      return { user: mappedUser, token: accessToken, restaurant };
    }
    throw new Error("Login failed");
  };

  const registerWithGraphQL = async (
    name: string,
    email: string,
    password: string,
    role: string = "client"
  ) => {
    const result = await registerMutation({
      variables: { input: { name, email, password, role } },
    });

    if (result.data?.register) {
      const { accessToken, user } = result.data.register;
      const mappedUser = {
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role as "admin" | "superadmin" | "employee" | "client",
      };
      $user.set(mappedUser);
      localStorage.setItem("foodapp_user", JSON.stringify(mappedUser));
      localStorage.setItem("foodapp_token", accessToken);
      addToast("Cuenta creada exitosamente", "success");
      return { user: mappedUser, token: accessToken };
    }
    throw new Error("Registration failed");
  };

  return {
    loginWithGraphQL,
    registerWithGraphQL,
    loginLoading,
    registerLoading,
  };
}
