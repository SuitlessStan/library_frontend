import cookies from "js-cookie"
import { UserData } from "./useUser"

export const getUserFromCookie = () => {
  const cookie = cookies.get("auth")
  if (!cookie) {
    return null
  }
  return JSON.parse(cookie) as UserData
}

export const setUserCookie = (user: UserData) => {
  cookies.set("auth", JSON.stringify(user), {
    expires: 1 / 24,
  })
}

export const removeUserCookie = () => cookies.remove("auth")
