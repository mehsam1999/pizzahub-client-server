import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URL as string)
const db = client.db("pizzahubdb")

export const ROLES = ["customer", "vendor", "admin"] as const

export type Role = (typeof ROLES)[number]

const roleSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "pizzahub",
    validate(value: unknown) {
      return ROLES.includes(value as Role)
        ? { value: value as Role }
        : {
            issues: [
              {
                message: `Role must be one of: ${ROLES.join(", ")}`,
              },
            ],
          }
    },
  },
}

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
        validator: {
          input: roleSchema,
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
