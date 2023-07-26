import Link from "next/link"
import CyclingBackground from "@/components/cyclingBackground/cyclingBackground"

export default function Home() {
  return (
    <>
      {/* <div className="background-cover absolute"></div> */}
      <CyclingBackground />
      <div className="flex flex-col justify-center items-center px-4 z-10 relative top-60 text-center">
        <h1 className="text-5xl mt-10 font-Roboto my-4">Virtual Library</h1>
        <span className="text-2xl font-Roboto shadow-sm my-5">
          Start your own personal experience!
        </span>
        <Link href="#" className="px-4 py-3 my-2 border rounded bg-white text-black opacity-90">
          Join now!
        </Link>
        <Link href="#" className="px-4 py-3 border rounded bg-white text-black opacity-90">
          Already a member
        </Link>
      </div>
    </>
  )
}
