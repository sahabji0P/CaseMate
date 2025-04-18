import { SignUp } from "@clerk/nextjs";


export default function FormSignUp() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignUp />
        </div>
    )

}   