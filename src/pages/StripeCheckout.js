import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'

import CheckoutForm from './CheckoutForm'
import '../Stripe.css'
import { selectCurrentOrder } from '../features/order/orderSlice'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51PjQJwCn7NKAplG2qY7bKdEHwkpPj115RPllvil7UN2sLGSN5fXTGrh3VGh7A9YgIUd6iEPOh7hX29U1JbElhSM10043Wmgmc6'
)

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('')
  const currentOrder = useSelector(selectCurrentOrder)

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalAmount: currentOrder.totalAmount,
        orderId: currentOrder.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [])

  const appearance = {
    theme: 'stripe',
  }
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}
