import { createAuthClient } from "better-auth/react"

import { inferAdditionalFields, adminClient } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

import { ac, adminRole, customerRole, vendorRole } from "@/lib/auth-permissions"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
    inferAdditionalFields<typeof auth>(),

    adminClient({
      ac,

      roles: {
        admin: adminRole,
        customer: customerRole,
        vendor: vendorRole,
      },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
