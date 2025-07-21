// app/login/page.jsx
import SignUpForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <SignUpForm />
    </div>
  );
}
