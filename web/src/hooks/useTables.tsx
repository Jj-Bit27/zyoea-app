import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_TABLES = gql`
  query tables($restaurantId: ID!) {
    tables(restaurantId: $restaurantId) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      bookingId
      number
      capacity
      status
    }
  }
`;

const GET_TABLE = gql`
  query table($id: ID!) {
    table(id: $id) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      bookingId
      number
      capacity
      status
    }
  }
`;

const CREATE_TABLE = gql`
  mutation CreateTable($input: CreateTableInput!) {
    createTable(input: $input) {
      id
      restaurantId
      number
      capacity
      status
    }
  }
`;

const UPDATE_TABLE = gql`
  mutation UpdateTable($id: ID!, $input: UpdateTableInput!) {
    updateTable(id: $id, input: $input) {
      id
      restaurantId
      bookingId
      number
      capacity
      status
    }
  }
`;

const DELETE_TABLE = gql`
  mutation DeleteTable($id: ID!) {
    deleteTable(id: $id)
  }
`;

export function useTables(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_TABLES, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_TABLE, {
    refetchQueries: [{ query: GET_TABLES, variables: { restaurantId } }],
    onCompleted: () => addToast("Mesa creada exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [deleteMutation] = useMutation(DELETE_TABLE, {
    refetchQueries: [{ query: GET_TABLES, variables: { restaurantId } }],
    onCompleted: () => addToast("Mesa eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createTable = (input: any) => {
    createMutation({ variables: { input } });
  };

  const deleteTable = (id: string) => {
    if (confirm("¿Eliminar mesa?")) {
      deleteMutation({ variables: { id } });
    }
  };

  return {
    tables: data?.tables || [],
    loading,
    error,
    createTable,
    deleteTable,
  };
}

export function useTableById(id: string) {
  const { data, loading, error } = useQuery(GET_TABLE, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation] = useMutation(UPDATE_TABLE, {
    onCompleted: () => addToast("Mesa actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateTable = (input: any) => {
    updateMutation({ variables: { id, input } });
  };

  return {
    table: data?.table || null,
    loading,
    error,
    updateTable,
  };
}
