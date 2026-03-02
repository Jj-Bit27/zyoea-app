import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";
import type { ProductData } from "../types";

// 1. Definimos todas las consultas aquí (centralizado)
const GET_PRODUCTS = gql`
  query products($restaurantId: ID!) {
    products(restaurantId: $restaurantId) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      categoryId
      category {
        id
        name
      }
      name
      description
      ingredients
      allergens
      price
      status
      image
    }
  }
`;

const GET_PRODUCT = gql`
  query product($id: ID!) {
    product(id: $id) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      categoryId
      category {
        id
        name
      }
      name
      description
      ingredients
      allergens
      price
      status
      image
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      categoryId
      category {
        id
        name
      }
      name
      description
      ingredients
      allergens
      price
      status
      image
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      categoryId
      category {
        id
        name
      }
      name
      description
      ingredients
      allergens
      price
      status
      image
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export function useProducts(restaurantId: string) {
  // --- LEER (Get All) ---
  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCTS, {
    variables: { restaurantId },
  });

  // --- CREAR ---
  const [createMutation] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }], // Actualiza la lista automáticamente
    onCompleted: () => addToast("Producto creado exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  // --- ELIMINAR ---
  const [deleteMutation] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }], // O usa update() de caché para ser más pro
    onCompleted: () => addToast("Producto eliminado", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  //
  const createProduct = (productData: any) => {
    createMutation({ variables: { input: productData } });
  };

  const deleteProduct = (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      deleteMutation({ variables: { id } });
    }
  };

  // Retornamos solo lo que la UI necesita
  return {
    products: data?.products || [], // Devolvemos el array directo
    loading,
    error,
    createProduct,
    deleteProduct,
  };
}

export function useProductById(id: string) {
  // --- LEER (Get One) ---
  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, {
    variables: { id },
  });

  // --- ACTUALIZAR ---
  const [updateMutation] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => addToast("Producto actualizado", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateProduct = (id: string, productData: any) => {
    updateMutation({ variables: { id, input: productData } });
  };

  return {
    products: data?.products || [], // Devolvemos el array directo
    loading,
    error,
    updateProduct,
  };
}
