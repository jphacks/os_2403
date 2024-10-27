import { Property } from "csstype";
import Page = Property.Page;
import { SignUpDialog } from "@/feature/signup/components/signup";

const SignupPage = () => {
	return <SignUpDialog type={"community"} />;
};

export default SignupPage;
