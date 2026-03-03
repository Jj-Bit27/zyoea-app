import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { addToast } from "../components/custom/Toast";

const GET_EMPLOYEES = gql`
  query employeesByRestaurant($restaurantId: ID!) {
    employeesByRestaurant(restaurantId: $restaurantId) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      position
      hireDate
      userId
      user {
        id
        name
        email
      }
    }
  }
`;

const GET_EMPLOYEE = gql`
  query employee($id: ID!) {
    employee(id: $id) {
      id
      restaurantId
      restaurant {
        id
        name
      }
      position
      hireDate
      userId
      user {
        id
        name
        email
      }
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      restaurantId
      position
      userId
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      restaurantId
      position
    }
  }
`;

const REMOVE_EMPLOYEE = gql`
  mutation RemoveEmployee($id: ID!) {
    removeEmployee(id: $id)
  }
`;

export function useEmployees(restaurantId: string) {
  const { data, loading, error } = useQuery(GET_EMPLOYEES, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [createMutation] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { restaurantId } }],
    onCompleted: () => addToast("Empleado creado exitosamente", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const [removeMutation] = useMutation(REMOVE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { restaurantId } }],
    onCompleted: () => addToast("Empleado eliminado", "info"),
    onError: (err) => addToast(err.message, "error"),
  });

  const createEmployee = (input: any) => {
    createMutation({ variables: { input } });
  };

  const removeEmployee = (id: string) => {
    if (confirm("¿Eliminar empleado?")) {
      removeMutation({ variables: { id } });
    }
  };

  return {
    employees: data?.employeesByRestaurant || [],
    loading,
    error,
    createEmployee,
    removeEmployee,
  };
}

export function useEmployeeById(id: string) {
  const { data, loading, error } = useQuery(GET_EMPLOYEE, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => addToast("Empleado actualizado", "success"),
    onError: (err) => addToast(err.message, "error"),
  });

  const updateEmployee = (input: any) => {
    updateMutation({ variables: { input: { id, ...input } } });
  };

  return {
    employee: data?.employee || null,
    loading,
    error,
    updateEmployee,
  };
}
