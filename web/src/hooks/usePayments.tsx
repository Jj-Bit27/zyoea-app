import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_PAYMENTS = gql`
  query payments($limit: Int, $offset: Int) {
    payments(limit: $limit, offset: $offset) {
      id
      userId
      stripePaymentIntentId
      amount
      currency
      status
      description
      createdAt
    }
  }
`;

const GET_USER_PAYMENTS = gql`
  query userPayments($userId: String!) {
    userPayments(userId: $userId) {
      id
      userId
      stripePaymentIntentId
      amount
      currency
      status
      description
      createdAt
    }
  }
`;

export function usePayments(limit?: number, offset?: number) {
  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { limit, offset },
  });

  return {
    payments: data?.payments || [],
    loading,
    error,
  };
}

export function useUserPayments(userId: string) {
  const { data, loading, error } = useQuery(GET_USER_PAYMENTS, {
    variables: { userId },
    skip: !userId,
  });

  return {
    payments: data?.userPayments || [],
    loading,
    error,
  };
}
