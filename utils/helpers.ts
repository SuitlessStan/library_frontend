export const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
}

export function getUniqueListBy<T>(arr: T[], key: string): T[] {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}
