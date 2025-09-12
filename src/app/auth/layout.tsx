import Link from "next/link";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <div className=" bg-gradient-to-bl from-violet-500/30 to-black   flex flex-col items-center justify-center m-auto w-full h-full">
            <div className="flex flex-row justify-between items-center gap-4">
                <Link href={'/'}>
                    <span className="p-3 rounded-2xl bg-violet-200/20 cursor-pointer hover:bg-white hover:text-black font-bold ">HOME</span>

                </Link>
                <h1 className="text-8xl font-bold font-serif text-white">Quiet Hour Scheduler</h1>
            </div>
            <div>
                {children}
            </div>
        </div>

    </>;
}