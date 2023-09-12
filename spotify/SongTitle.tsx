import { usePlaybackState } from "react-spotify-web-playback-sdk"

const SongTitle: React.VFC = () => {
  const playbackState = usePlaybackState()

  if (playbackState === null) return null

  return <p>Current song: {playbackState.track_window.current_track.name}</p>
}

export default SongTitle
