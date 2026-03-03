import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_REVIEWS = gql`
  query reviews($restaurantId: ID!) {
    reviews(restaurantId: $restaurantId) {
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
      }
      rating
      comment
      date
    }
  }
`;

const GET_REVIEW = gql`
  query review($id: ID!) {
    review(id: $id) {
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
      }
      rating
      comment
      date
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      restaurantId
      userId
      rating
      comment
      date
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      restaurantId
      userId
      rating
      comment
      date
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export function useReviews(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reseña creada exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [deleteMutation] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reseña eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createReview = (input: any) => {
    createMutation({ variables: { input } });
  };

  const deleteReview = (id: string) => {
    if (confirm("¿Eliminar reseña?")) {
      deleteMutation({ variables: { id } });
    }
  };

  return {
    reviews: data?.reviews || [],
    loading,
    error,
    createReview,
    deleteReview,
  };
}

export function useReviewById(id: string) {
  const { data, loading, error } = useQuery(GET_REVIEW, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation] = useMutation(UPDATE_REVIEW, {
    onCompleted: () => addToast("Reseña actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateReview = (input: any) => {
    updateMutation({ variables: { id, input } });
  };

  return {
    review: data?.review || null,
    loading,
    error,
    updateReview,
  };
}
