
import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const adminRole = ac.newRole({
  ...adminAc.statements,
})

export const customerRole = ac.newRole({
  ...userAc.statements,
})

export const vendorRole = ac.newRole({
  ...userAc.statements,
})
