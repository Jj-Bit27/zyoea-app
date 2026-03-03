import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_BOOKINGS = gql`
  query bookings($restaurantId: ID!) {
    bookings(restaurantId: $restaurantId) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      userId
      user {
        id
        name
        email
      }
      tableId
      people
      time
      status
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      userId
      tableId
      people
      time
      status
    }
  }
`;

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: UpdateBookingInput!) {
    updateBooking(id: $id, input: $input) {
      id
      status
      people
      time
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

export function useBookings(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_BOOKINGS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reservación creada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [updateMutation] = useMutation(UPDATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reservación actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [deleteMutation] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reservación eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createBooking = (input: {
    restaurant: number;
    user: number;
    table: number;
    people: number;
    time: string;
    status: string;
  }) => {
    createMutation({ variables: { input } });
  };

  const updateBooking = (id: string, input: { status?: string; people?: number; time?: string }) => {
    updateMutation({ variables: { id, input: { ...input } } });
  };

  const deleteBooking = (id: string) => {
    if (confirm("¿Eliminar reservación?")) {
      deleteMutation({ variables: { id } });
    }
  };

  return {
    bookings: data?.bookings || [],
    loading,
    error,
    createBooking,
    updateBooking,
    deleteBooking,
  };
}
