import crypto from "crypto";

export const PAYFAST_IS_PRODUCTION = process.env.CURRENT_ENV === "production";

export const PAYFAST_MERCHANT_ID = PAYFAST_IS_PRODUCTION
  ? process.env.PAYFAST_MERCHANT_ID || ""
  : process.env.PAYFAST_SANDBOX_MERCHANT_ID || "";

export const PAYFAST_MERCHANT_KEY = PAYFAST_IS_PRODUCTION
  ? process.env.PAYFAST_MERCHANT_KEY || ""
  : process.env.PAYFAST_SANDBOX_MERCHANT_KEY || "";

export const PAYFAST_PASSPHRASE = PAYFAST_IS_PRODUCTION
  ? process.env.PAYFAST_PASSPHRASE || ""
  : process.env.PAYFAST_SANDBOX_PASSPHRASE || "";

export const PAYFAST_URL = PAYFAST_IS_PRODUCTION
  ? "https://www.payfast.co.za/eng/process"
  : "https://sandbox.payfast.co.za/eng/process";

export const PAYFAST_VALIDATION_URL = PAYFAST_IS_PRODUCTION
  ? "https://www.payfast.co.za/eng/query/validate"
  : "https://sandbox.payfast.co.za/eng/query/validate";

// Strict ordering required for PayFast Hosted Payments signature generation
const PAYFAST_PAYLOAD_ORDER = [
  "merchant_id",
  "merchant_key",
  "return_url",
  "cancel_url",
  "notify_url",
  "name_first",
  "name_last",
  "email_address",
  "cell_number",
  "m_payment_id",
  "amount",
  "item_name",
  "item_description",
  "custom_int1",
  "custom_int2",
  "custom_int3",
  "custom_int4",
  "custom_int5",
  "custom_str1",
  "custom_str2",
  "custom_str3",
  "custom_str4",
  "custom_str5",
  "email_confirmation",
  "confirmation_address",
  "payment_method",
];

export function generatePayFastSignature(
  payload: Record<string, string>,
): string {
  let signatureString = "";

  for (const key of PAYFAST_PAYLOAD_ORDER) {
    if (payload[key] !== undefined && payload[key] !== "") {
      signatureString += `${key}=${encodeURIComponent(payload[key].trim()).replace(/%20/g, "+")}&`;
    }
  }

  signatureString = signatureString.slice(0, -1);

  if (PAYFAST_PASSPHRASE) {
    signatureString += `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(signatureString).digest("hex");
}
