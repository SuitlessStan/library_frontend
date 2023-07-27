import { useEffect } from "react"
import { useRouter } from "next/router"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import initFirebase from "../config"

initFirebase()
const auth = firebase.auth()

const withAuth = (Component: React.ComponentType<any>) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter()

    useEffect(() => {
      const cancelAuthListener = auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
          router.push("/signin")
        }
      })

      return () => cancelAuthListener()
    }, [])

    return (
      <div>
        <Component {...props} />
      </div>
    )
  }

  // Add the displayName property to the WithAuthComponent
  WithAuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Unknown"
  })`

  return WithAuthComponent
}

export default withAuth
