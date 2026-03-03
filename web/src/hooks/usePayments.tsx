import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_PAYMENTS = gql`
  query payments($limit: Int, $offset: Int) {
    payments(limit: $limit, offset: $offset) {
      id
      userId
      stripePaymentIntentId
      stripePaymentMethodId
      amount
      currency
      status
      description
      createdAt
      updatedAt
    }
  }
`;

const GET_PAYMENT = gql`
  query payment($id: ID!) {
    payment(id: $id) {
      id
      userId
      stripePaymentIntentId
      stripePaymentMethodId
      amount
      currency
      status
      description
      createdAt
      updatedAt
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
      updatedAt
    }
  }
`;

const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      userId
      stripePaymentIntentId
      amount
      currency
      status
      createdAt
    }
  }
`;

const REFUND_PAYMENT = gql`
  mutation RefundPayment($input: RefundPaymentInput!) {
    refundPayment(input: $input) {
      id
      status
      updatedAt
    }
  }
`;

export function usePayments(limit?: number, offset?: number) {
  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { limit, offset },
  });

  const [createMutation] = useMutation(CREATE_PAYMENT, {
    refetchQueries: [{ query: GET_PAYMENTS, variables: { limit, offset } }],
    onCompleted: () => addToast("Pago procesado exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [refundMutation] = useMutation(REFUND_PAYMENT, {
    refetchQueries: [{ query: GET_PAYMENTS, variables: { limit, offset } }],
    onCompleted: () => addToast("Reembolso procesado exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createPayment = (input: any) => {
    createMutation({ variables: { input } });
  };

  const refundPayment = (input: any) => {
    refundMutation({ variables: { input } });
  };

  return {
    payments: data?.payments || [],
    loading,
    error,
    createPayment,
    refundPayment,
  };
}

export function usePaymentById(id: string) {
  const { data, loading, error } = useQuery(GET_PAYMENT, {
    variables: { id },
    skip: !id,
  });

  return {
    payment: data?.payment || null,
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
