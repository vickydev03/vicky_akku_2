import { Context } from "elysia";
import { db } from "../../prisma/seed"; // Ensure this points to your prisma client instance
import { AppError } from "../lib/error";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

type ProductType = "WORKSHOP" | "TUTORIAL" | "CLASS";

export class OrderController {
  // 🔥 1. Create Order (Server-side initialization)
  static async createOrder({ body, store, set }: Context) {
    try {
      const user = (store as any).user;
      if (!user) throw new AppError("Unauthorized", 401);

      const { productId, productType } = body as {
        productId: string;
        productType: ProductType;
      };

      let price = 0;

      // ✅ 1. Validate Product & Check for existing access
      if (productType === "WORKSHOP") {
        const workshop = await db.workshop.findUnique({ where: { id: productId } });
        if (!workshop || !workshop.isActive) throw new AppError("Workshop not available", 404);
        
        const already = await db.enrollment.findUnique({
          where: { userId_workshopId: { userId: user.id, workshopId: productId } },
        });
        if (already) throw new AppError("Already purchased workshop", 400);
        price = workshop.price;
      } 
      
      else if (productType === "TUTORIAL") {
        const tutorial = await db.tutorials.findUnique({ where: { id: productId } });
        if (!tutorial || !tutorial.isPublished) throw new AppError("Tutorial not available", 404);
        
        const already = await db.tutorialAccess.findUnique({
          where: { userId_tutorialId: { userId: user.id, tutorialId: productId } },
        });
        if (already) throw new AppError("Already purchased tutorial", 400);
        price = tutorial.price || 0;
      } 
      
      else if (productType === "CLASS") {
        const cls = await db.regularClass.findUnique({ where: { id: productId } });
        if (!cls || !cls.isActive) throw new AppError("Class not available", 404);
        
        const already = await db.userSubscription.findFirst({
          where: { userId: user.id, classId: productId, status: "ACTIVE" },
        });
        if (already) throw new AppError("Already subscribed to class", 400);
        price = cls.price;
      }

      // ✅ 2. Create Razorpay Order (Amount in Paisa)
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(price * 100), 
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      // ✅ 3. Create Pending Order in DB
      const order = await db.order.create({
        data: {
          userId: user.id,
          amount: price,
          status: "PENDING",
          razorpayOrderId: razorpayOrder.id, // Store this to verify later
          productId,
          productType,
        },
      });

      return {
        success: true,
        order, // Return the whole order so frontend has razorpayOrderId
        keyId: process.env.RAZORPAY_API_KEY, // Frontend needs this to open modal
      };
    } catch (error: any) {
      set.status = error.statusCode || 500;
      return { success: false, message: error.message };
    }
  }

  // 🔥 2. Verify Payment (Security Check & Fulfillment)
  static async verifyPayment({ body, store, set }: Context) {
    try {
      const user = (store as any).user;
      if (!user) throw new AppError("Unauthorized", 401);

      const { 
        orderId, 
        razorpayPaymentId, 
        razorpayOrderId, 
        razorpaySignature 
      } = body as any;

      // ✅ 1. Security: HMAC Signature Verification
      // This prevents "Man-in-the-middle" attacks where users try to trigger fulfillment for free
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generated_signature !== razorpaySignature) {
        set.status = 400;
        throw new AppError("Payment verification failed. Signature mismatch.", 400);
      }

      // ✅ 2. Check if Order exists and isn't already processed
      const order = await db.order.findUnique({ where: { id: orderId } });
      if (!order) throw new AppError("Order record not found", 404);
      if (order.status === "PAID") return { success: true, message: "Already processed" };

      // ✅ 3. Atomic Transaction for Fulfillment
      await db.$transaction(async (tx) => {
        // Update Order Status
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentId: razorpayPaymentId,
          },
        });

        // Grant Access based on Product Type
        if (order.productType === "WORKSHOP") {
          await tx.enrollment.create({
            data: { userId: user.id, workshopId: order.productId },
          });
        } else if (order.productType === "TUTORIAL") {
          await tx.tutorialAccess.create({
            data: { userId: user.id, tutorialId: order.productId, createdAt: new Date() },
          });
        } else if (order.productType === "CLASS") {
          await tx.userSubscription.create({
            data: { userId: user.id, classId: order.productId, status: "ACTIVE" },
          });
        }
      });

      return {
        success: true,
        message: "Payment verified and access granted",
      };
    } catch (error: any) {
      set.status = error.statusCode || 500;
      return { success: false, message: error.message };
    }
  }
}