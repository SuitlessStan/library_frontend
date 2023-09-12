import { useErrorState } from "react-spotify-web-playback-sdk/dist/errorState"

const ErrorState = () => {
  const errorState = useErrorState()

  if (errorState === null) return null

  return <p>Error: {errorState.message}</p>
}

export default ErrorState
