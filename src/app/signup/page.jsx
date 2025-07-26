// app/signup/page.jsx
import SignUpForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* <h1 className="text-2xl font-bold mb-4">Signup</h1> */}
      <SignUpForm />
    </div>
  );
}
