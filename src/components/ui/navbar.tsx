import Link from "next/link";
import {Icons} from "../icons";
import {buttonVariants} from "./Button";
import {getAuthSession} from "@/lib/auth";
import UserAccountNav from "./user-account-nav";
import SearchBar from "./searchbar";

type Props = {};

async function Navbar({}: Props) {
  const session = await getAuthSession();
  return (
    <div className="fixed  top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href={"/"} prefetch={false} className="flex items-center gap-2 ">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Breadit
          </p>
        </Link>
        {/* searchbar */}
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link href={"/sign-in"} prefetch={false} className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
