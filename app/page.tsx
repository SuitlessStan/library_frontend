export default function Home() {
  return (
    <>
      <div className="background-cover absolute"></div>
      <div className="flex flex-col justify-center items-center px-4 z-10 relative top-80 text-center">
        <h1 className="text-4xl mt-10 font-Roboto my-4">Virtual Library</h1>
        <span className="text-lg font-Roboto shadow-sm my-5">
          Start your own personal experience!
        </span>
        <a href="#" className="px-4 py-3 my-5 border rounded bg-white text-black opacity-90">
          Join now!
        </a>
      </div>
    </>
  )
}
