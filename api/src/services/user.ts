import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { User, UserWithId, Users } from '../models/user'

type SaltOptions = {
  rounds: number
}

const SALT_ROUNDS = 10

const hashPassword = async (password: string, options?: SaltOptions) => {
  try {
    const salt = await bcrypt.genSalt(options?.rounds || SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)
    return { salt, hashedPassword }
  } catch (err) {
    throw new Error('Error while hashing password.')
  }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (err) {
    throw new Error('Error while comparing password.')
  }
}

export const createUser = async (
  userBody: Omit<User, 'salt'>
): Promise<Omit<UserWithId, 'password' | 'salt'>> => {
  try {
    const { password, ...rest } = userBody
    const { salt, hashedPassword } = await hashPassword(password!)
    const insertResult = await Users.insertOne({
      ...rest,
      password: hashedPassword,
      salt,
    })
    if (!insertResult.acknowledged) throw new Error('Error inserting user.')
    return {
      _id: insertResult.insertedId,
      ...rest,
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Error while creating user')
  }
}

export const findUserById = async (id: string) => {
  return Users.findOne({
    _id: new ObjectId(id),
  })
}

export const findUserByEmail = async (email: string) => {
  return Users.findOne({
    email,
  })
}
