// app/signup/page.jsx
import SignUpForm from "../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      {/* <h1 className="text-2xl font-bold mb-4">Signup</h1> */}
      <SignUpForm />
    </div>
  );
}
