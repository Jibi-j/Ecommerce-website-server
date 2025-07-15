const mongoose = require("mongoose");
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const client_domain = process.env.CLIENT_DOMAIN;

// Create Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products found in request." });
    }

    //console.log("Body Received:", products); 

    const lineItems = products.map((product) => {
      //console.log("Each product:", product); 
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: product.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: lineItems,
  mode: "payment",
  success_url: `${client_domain}/cart?success=true`,
  cancel_url: `${client_domain}/cart?canceled=true`,
});


    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Verify Checkout Session 
const verifyCheckoutSession = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Session verified" });
  } catch (error) {
    console.error("Verify Session Error:", error);
    res.status(500).json({ message: "Failed to verify session" });
  }
};

module.exports = {createCheckoutSession,verifyCheckoutSession,};
