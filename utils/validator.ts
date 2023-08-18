export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return email.trim() ? emailRegex.test(email) : false
}

export const validatePassword = (password: string) => {
  return password.trim() && password.length >= 6
}
