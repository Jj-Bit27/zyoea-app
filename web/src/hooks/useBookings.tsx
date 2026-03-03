import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_BOOKINGS = gql`
  query bookings($restaurant: ID!) {
    bookings(restaurant: $restaurant) {
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

const GET_BOOKING = gql`
  query booking($id: ID!) {
    booking(id: $id) {
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
      restaurantId
      tableId
      people
      time
      status
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
    variables: { restaurant: restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS, variables: { restaurant: restaurantId } }],
    onCompleted: () => addToast("Reserva creada exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [deleteMutation] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS, variables: { restaurant: restaurantId } }],
    onCompleted: () => addToast("Reserva eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createBooking = (input: any) => {
    createMutation({ variables: { input } });
  };

  const deleteBooking = (id: string) => {
    if (confirm("¿Eliminar reserva?")) {
      deleteMutation({ variables: { id } });
    }
  };

  return {
    bookings: data?.bookings || [],
    loading,
    error,
    createBooking,
    deleteBooking,
  };
}

export function useBookingById(id: string) {
  const { data, loading, error } = useQuery(GET_BOOKING, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation] = useMutation(UPDATE_BOOKING, {
    onCompleted: () => addToast("Reserva actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateBooking = (input: any) => {
    updateMutation({ variables: { id, input } });
  };

  return {
    booking: data?.booking || null,
    loading,
    error,
    updateBooking,
  };
}
