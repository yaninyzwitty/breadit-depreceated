import {buttonVariants} from "@/components/ui/Button";
import {toast} from "@/components/ui/use-toast";
import Link from "next/link";

function UseCustomToast() {
  const loginToast = () => {
    const {dismiss} = toast({
      title: "Login Required!",
      description: "You need to be logged in to to that",
      variant: "destructive",
      action: (
        <Link
          className={buttonVariants({
            variant: "outline",
          })}
          href={"/sign-in"}
          prefetch={false}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      ),
    });
  };
  return {loginToast};
}

export default UseCustomToast;
