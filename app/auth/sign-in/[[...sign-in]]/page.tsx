/** @jsxImportSource react */
import { SignIn } from "@clerk/nextjs";

const UserSignIn = () => {
    return (
        <div className="flex items-center justify-center min-h-screen" >
            <SignIn />
        </div>
    );
}

export default UserSignIn;
