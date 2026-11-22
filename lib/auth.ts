import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin as adminPlugin } from "better-auth/plugins"

import { ac, adminRole, customerRole, vendorRole } from "@/lib/auth-permissions"

const client = new MongoClient(process.env.MONGODB_URL as string)

const db = client.db("pizzahubdb")

export const ROLES = ["customer", "vendor", "admin"] as const

export type Role = (typeof ROLES)[number]

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {},

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    adminPlugin({
      ac,

      roles: {
        admin: adminRole,
        customer: customerRole,
        vendor: vendorRole,
      },

      defaultRole: "customer",

      adminRoles: ["admin"],

      bannedUserMessage:
        "Your account has been blocked. Please contact PizzaHub support.",
    }),
  ],
})
