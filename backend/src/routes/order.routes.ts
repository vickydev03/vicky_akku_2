import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { OrderController } from "../controller/order.controller";

export const orderRoutes = new Elysia({ prefix: "/order" })
  // Apply auth to all routes in this group if they all require login
  // .use(authMiddleware) 
  
  // 1. Create Order Route
  .post("/create", OrderController.createOrder, {
    body: t.Object({
      productId: t.String(),
      productType: t.Union([
        t.Literal("WORKSHOP"),
        t.Literal("TUTORIAL"),
        t.Literal("CLASS")
      ]),
    }),
    detail: {
      summary: "Initialize a Razorpay payment",
      tags: ['Order']
    }
    ,beforeHandle:[authMiddleware]
  })

  // 2. Verify Payment Route
  .post("/verify", OrderController.verifyPayment, {
    body: t.Object({
      orderId: t.String(),           // Internal DB Order ID
      razorpayOrderId: t.String(),   // Starts with 'order_'
      razorpayPaymentId: t.String(), // Starts with 'pay_'
      razorpaySignature: t.String(), // HMAC Signature
    }),
    detail: {
      summary: "Verify signature and grant access",
      tags: ['Order']
    },
    beforeHandle:[authMiddleware]
  });