/** @jsxImportSource react */
import { SignIn } from "@clerk/nextjs";

const UserSignIn = () => {
    return (
        <div className="flex items-center justify-center min-h-screen" >

            <SignIn />

            <div className="bg-yellow-200 text-black p-4 rounded mb-4">
                Note: By filling out this form, you agree that your personal data will be stored in our database and used across the whole application.
            </div>
        </div>
    );
}

export default UserSignIn;
