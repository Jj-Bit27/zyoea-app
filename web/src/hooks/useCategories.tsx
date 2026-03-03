import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";
import type { CategoryData } from "../types";

// 1. Definimos todas las consultas aquí (centralizado)
const GET_CATEGORIES = gql`
  query categories($restaurantId: ID!) {
    categories(restaurantId: $restaurantId) {
      id
      restaurantId
      restaurant {
        id
        name
        address
        email
        description
        image
        phone
        hours
      }
      name
    }
  }
`;

const GET_CATEGORY = gql`
  query category($id: ID!) {
    category(id: $id) {
      id
      restaurantId
      restaurant {
        id
        name
        address
        email
        description
        image
        phone
        hours
      }
      name
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      restaurantId
      restaurant {
        id
        name
        address
        email
        description
        image
        phone
        hours
      }
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      restaurantId
      restaurant {
        id
        name
        address
        email
        description
        image
        phone
        hours
      }
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export function useCategories(restaurantId: string) {
  // --- LEER (Get All) ---
  const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORIES, {
    variables: { restaurantId },
  });

  // --- CREAR ---
  const [createMutation] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES, variables: { restaurantId } }],
    onCompleted: () => addToast("Categoría creada exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  // --- ELIMINAR ---
  const [deleteMutation] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES, variables: { restaurantId } }],
    onCompleted: () => addToast("Categoría eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createCategory = (categoryData: any) => {
    createMutation({ variables: { input: categoryData } });
  };

  const deleteCategory = (id: string) => {
    if (confirm("¿Eliminar categoría?")) {
      deleteMutation({ variables: { id } });
    }
  };

  // Retornamos solo lo que la UI necesita
  return {
    categories: data?.categories || [],
    loading,
    error,
    createCategory,
    deleteCategory,
  };
}

export function useCategoryById(id: string) {
  // --- LEER (Get One) ---
  const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORY, {
    variables: { id },
  });

  // --- ACTUALIZAR ---
  const [updateMutation] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => addToast("Categoría actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateCategory = (id: string, categoryData: any) => {
    updateMutation({ variables: { id, input: categoryData } });
  };

  // Retornamos solo lo que la UI necesita
  return {
    categories: data?.categories || [],
    loading,
    error,
    updateCategory,
  };
}
