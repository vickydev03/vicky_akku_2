import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sentSms(body:string,phone_no:string) :Promise<void>{
  const message = await client.messages.create({
    body: body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone_no,
  });
  
  console.log(message.body);
}
