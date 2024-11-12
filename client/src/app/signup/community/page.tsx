import { Property } from "csstype";
import Page = Property.Page;
import { SignUpDialog } from "@/feature/signup/components/signup";
import style from "./style.module.scss";

const SignupPage = () => {
  return (
    <div className={style.all}>
      <SignUpDialog type={"community"} />
    </div>
  );
};

export default SignupPage;
