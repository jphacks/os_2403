import { SignUpDialog } from "@/features/signup/components/signup";
// import style from "./style.module.scss";

const SignupPage = () => {
  return (
    // <div className={style.all}>
    <div>
      <SignUpDialog type={"community"} />
    </div>
  );
};

export default SignupPage;
