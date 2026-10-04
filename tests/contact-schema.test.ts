import { describe, expect, test } from "bun:test";
import { flattenError } from "zod/mini";
import { createContactFormSchema } from "../lib/contact/schema";
import { PRODUCT_IDS } from "../lib/contact/products";
import { DICTIONARIES } from "../lib/i18n/dictionaries";

const valid = {
  email: "  test@example.com  ",
  message: "  A product question.  ",
  agree: true,
  product: PRODUCT_IDS[0],
};

for (const locale of ["ko", "en", "ja"] as const) {
  describe(`${locale} contact validation`, () => {
    const messages = DICTIONARIES[locale].contact.validation;
    const schema = createContactFormSchema(messages);

    test.each(PRODUCT_IDS)("accepts %s and trims submitted text", (product) => {
      expect(schema.parse({ ...valid, product })).toEqual({
        ...valid, product, email: "test@example.com", message: "A product question.",
      });
    });

    test.each([
      ["email", "   ", "emailRequired"],
      ["email", "not-an-email", "emailInvalid"],
      ["message", "   ", "messageRequired"],
      ["message", "x".repeat(5001), "messageTooLong"],
      ["agree", false, "agreeRequired"],
      ["product", "", "productRequired"],
      ["product", "unknown-product", "productRequired"],
    ] as const)("validates %s (case %#)", (field, value, messageKey) => {
      const result = schema.safeParse({ ...valid, [field]: value });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(flattenError(result.error).fieldErrors[field]?.[0]).toBe(messages[messageKey]);
      }
    });

    test("validates email on blur and accepts the message length limit", () => {
      expect(schema.shape.email.safeParse("bad@").success).toBe(false);
      expect(schema.shape.email.parse(" test@example.com ")).toBe("test@example.com");
      expect(schema.safeParse({ ...valid, message: "x".repeat(5000) }).success).toBe(true);
    });

    test("preserves optional tokens and the honeypot, stripping unknown fields", () => {
      expect(schema.parse({ ...valid, turnstileToken: "token", _hp: "bot", extra: true })).toEqual({
        ...valid, email: "test@example.com", message: "A product question.",
        turnstileToken: "token", _hp: "bot",
      });
    });
  });
}
