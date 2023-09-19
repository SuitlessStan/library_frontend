import { Book } from "./types"

export const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
}

export function getUniqueListBy<T>(arr: Book[], key: string): Book[] {
  return [...new Map(arr.map((item: any) => [item[key], item])).values()]
}
