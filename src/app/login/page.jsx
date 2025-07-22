// app/login/page.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Login</h1> */}
      <LoginForm />
    </div>
  );
}
