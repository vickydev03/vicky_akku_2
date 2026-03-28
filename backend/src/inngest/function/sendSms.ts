import { inngest } from "../../lib/inngest";
import { sentSms } from "../../lib/twilio";

export const sendOtp= inngest.createFunction(
  { id: "send-otp-sms" },
  { event: "otp/send" },
  async ({ event, step }) => {
    const { phone, otp } = event.data;
    await step.run("send-sms", async () => {
      await sentSms(
        `Your OTP is ${otp}. Do not share this with anyone. Valid for 10 minutes.`,
        phone,
      );
      return { success: true };
    });
  },
);
