import styled from "styled-components";
import { useMutation, gql } from "@apollo/client";
import { ca } from "date-fns/locale";

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;
const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}
export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    /* optimisticResponse: {
      deleteCartItem: {
        id,
        __typename: 'CartItem',
      },
    }, */
  });
  return (
    <BigButton
      type="button"
      title="Remove from cart"
      disabled={loading}
      onClick={removeFromCart}
    >
      &times;
    </BigButton>
  );
}
