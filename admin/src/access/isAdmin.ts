import type { Access, FieldAccess, PayloadRequest } from 'payload/types'

// import type { User } from '../payload-types'
type User = any

export const isAdmin: Access<
  PayloadRequest<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  User
> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}
