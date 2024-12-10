import { SignInDialog } from "@/features/signin/components/Signin";
import style from "./style.module.scss";

const SignInPage = () => {
  return (
    <div className={style.all}>
      <SignInDialog type={"community"} />
    </div>
  );
};

export default SignInPage;
