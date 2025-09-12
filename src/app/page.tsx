
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen m-auto">
        <h1 className="text-white">Quiet Hour Scheduler</h1>
        <Link href={"/auth"}>
          <button className="bg-violet-900/30 p-3 rounded-2xl hover:bg-white hover:text-black cursor-pointer">
            Authenticate Yourself (sign Up or Login)
          </button>
        </Link>


      </div>
    </>
  );
}
