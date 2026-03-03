import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_REVIEWS = gql`
  query reviews($restaurantId: ID!) {
    reviews(restaurantId: $restaurantId) {
      id
      restaurantId
      userId
      user {
        id
        name
        email
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
      user {
        id
        name
        email
      }
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
      rating
      comment
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
    onCompleted: () => addToast("Reseña publicada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [updateMutation] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reseña actualizada", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [deleteMutation] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { restaurantId } }],
    onCompleted: () => addToast("Reseña eliminada", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createReview = (input: {
    restaurant: number;
    user: number;
    rating: number;
    comment: string;
  }) => {
    createMutation({ variables: { input } });
  };

  const updateReview = (id: string, input: { rating?: number; comment?: string }) => {
    updateMutation({ variables: { id, input: { ...input } } });
  };

  const deleteReview = (id: string) => {
    deleteMutation({ variables: { id } });
  };

  return {
    reviews: data?.reviews || [],
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
  };
}
