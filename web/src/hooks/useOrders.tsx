import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_ORDERS = gql`
  query ordersByRestaurant($restaurantId: ID!) {
    ordersByRestaurant(restaurantId: $restaurantId) {
      id
      userId
      user_name
      restaurantId
      restaurant {
        id
        name
      }
      status
      type
      total
      notes
      tableId
      date
      paid
    }
  }
`;

const GET_ORDER = gql`
  query order($id: ID!) {
    order(id: $id) {
      id
      userId
      user_name
      restaurantId
      restaurant {
        id
        name
      }
      status
      type
      total
      notes
      tableId
      date
      paid
      orderDetail {
        id
        productId
        product {
          id
          name
          price
        }
        quantity
        subtotal
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      userId
      restaurantId
      status
      type
      total
      date
      paid
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      status
      paid
    }
  }
`;

const REMOVE_ORDER = gql`
  mutation RemoveOrder($id: ID!) {
    removeOrder(id: $id)
  }
`;

export function useOrders(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS, variables: { restaurantId } }],
    onCompleted: () => addToast("Orden creada exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [removeMutation] = useMutation(REMOVE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS, variables: { restaurantId } }],
    onCompleted: () => addToast("Orden eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createOrder = (input: any) => {
    createMutation({ variables: { input } });
  };

  const removeOrder = (id: string) => {
    if (confirm("¿Eliminar orden?")) {
      removeMutation({ variables: { id } });
    }
  };

  return {
    orders: data?.ordersByRestaurant || [],
    loading,
    error,
    createOrder,
    removeOrder,
  };
}

export function useOrderById(id: string) {
  const { data, loading, error } = useQuery(GET_ORDER, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation] = useMutation(UPDATE_ORDER, {
    onCompleted: () => addToast("Orden actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateOrder = (input: any) => {
    updateMutation({ variables: { input } });
  };

  return {
    order: data?.order || null,
    loading,
    error,
    updateOrder,
  };
}
