"use client";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import styled from "styled-components";
import { useState } from "react";
import SickButton from "./styles/SickButton";

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      setError({ message: "Stripe has not loaded yet. Please try again." });
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    console.log("Thanks for ordering!");

    try {
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

      console.log(paymentMethod);

      if (stripeError) {
        setError(stripeError);
      } else {
        console.log("Payment method created successfully:", paymentMethod);
      }
    } catch (err) {
      setError({ message: "An unexpected error occurred. Please try again." });
      console.error("Payment error:", err);
    }

    setLoading(false);
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-700">
          Missing Stripe configuration. Please add NEXT_PUBLIC_STRIPE_KEY to
          your environment variables.
        </p>
      </div>
    );
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
          },
        }}
      />
      <SickButton type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Check Out Now"}
      </SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  if (!stripePromise) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-700">
          Stripe configuration is missing. Please check your environment
          variables.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
