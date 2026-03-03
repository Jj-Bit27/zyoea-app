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
          image
        }
        quantity
        subtotal
      }
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      status
      paid
    }
  }
`;

const REMOVE_ORDER = gql`
  mutation removeOrder($id: ID!) {
    removeOrder(id: $id)
  }
`;

export function useOrders(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [updateMutation] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS, variables: { restaurantId } }],
    onCompleted: () => addToast("Orden actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [removeMutation] = useMutation(REMOVE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS, variables: { restaurantId } }],
    onCompleted: () => addToast("Orden eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateOrder = (id: string, estado: string) => {
    updateMutation({ variables: { input: { id, estado } } });
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
    updateOrder,
    removeOrder,
  };
}
