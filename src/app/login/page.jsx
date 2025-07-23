// app/login/page.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      {/* <h1 className="text-2xl font-bold mb-4">Login</h1> */}
      <LoginForm />
    </div>
  );
}
