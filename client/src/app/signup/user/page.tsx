import { Property } from "csstype";
import Page = Property.Page;
import { SignUpDialog } from "@/features/signup/components/signup";

const SignupPage = () => {
	return <SignUpDialog introduction="自己紹介" />;
};

export default SignupPage;
