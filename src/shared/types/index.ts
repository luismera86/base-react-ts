export const UserRole = {
  Guest: 0,
  User: 1,
  Moderator: 2,
  Admin: 3,
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export type Permission = string
