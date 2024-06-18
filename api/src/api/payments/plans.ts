export const pricingPlans = [
  {
    type: "Monthly Plan",
    price: "₹300",
    subscription: "month",
    description: "Short-term commitment, long-term benefits",
    buttonText: "Oh, you're cheap like that!",
    planId: "plan_OGJBERVlls0I6x",
    free_trial: 7 * 24 * 60 * 60, // one week in seconds
    discountPlanId: "plan_OIXYkFyKBCbzu6",
    discountPrice: "₹249",
    total_count: 9,
    features: [
      "7-days free trial",
      "Access to all features",
      "Add a partner for free",
    ],
  },
  {
    type: "3-Month Plan",
    price: "₹700",
    subscription: "year",
    description: "Flexibility for the cautious planner",
    buttonText: "Getting Warmer!",
    planId: "plan_OGJAF89KZahsm8",
    free_trial: 14 * 24 * 60 * 60,
    total_count: 3,
    discountPlanId: "plan_OIXaWIAZy8YllS",
    discountPrice: "₹599",
    features: [
      "14-day free trail",
      "Access to all features",
      "Add a partner for free",
    ],
  },
  {
    type: "One-Time Payment",
    price: "₹1800",
    subscription: "",
    description: "One payment, endless peace of mind",
    buttonText: "Genius Move!",
    active: true,
    planId: "plan_OGJBbgZrKBoLd0",
    free_trial: 30 * 24 * 60 * 60,
    total_count: 1,
    discountPlanId: "plan_OIXbgXEQ8wj6m2",
    discountPrice: "₹1599",
    features: [
      "Access to all features",
      "Use for multiple children",
      "Use for multiple children"
    ],
  },
];