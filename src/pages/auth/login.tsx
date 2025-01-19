import { useId, useState } from "react";
import { signIn, signUp } from "aws-amplify/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DevButton from "../../components/dev-components/dev-button";
import { RiLoader2Fill } from "react-icons/ri";
import DevInput from "../../components/dev-components/dev-input";
import { nanoid } from "nanoid";
import { DevForm, FormInput } from "../../components/dev-components/dev-form";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      validate: (value: string) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        return null;
      },
    },
  };

  const handleSubmit = async (result: {
    values: Record<string, string | File | boolean> | null;
    errors: Record<string, string> | null;
  }) => {
    if (result.values) {
      const { email, password } = result.values;

      try {
        setIsLoading(true);
        // First attempt to sign in
        const signInResponse = await signIn({
          username: String(email),
          password: String(password),
        });

        if (signInResponse.isSignedIn) {
          toast.success("🤟 Welcome back!");
          navigate("/dashboard");
          return;
        } else {
          toast.error("Please complete the signup process");
          navigate("/signup");
          return;
        }
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred during sign in");
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="grid grid-rows-[30vh,1fr] h-screen w-full relative">
      <div></div>
      <div className="w-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border p-4 py-6 shadow">
        <div>
          <div className="text-2xl">Welcome Back 👋</div>
          <div>Login in to your account to continue</div>
        </div>
        <br />
        <DevForm
          className="space-y-3"
          onSubmit={handleSubmit}
          validationRules={validationRules}
        >
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
          />
          <FormInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
          />
          <div className="flex items-center justify-between">
            <a
              href="/forgot-password"
              className="text-sm text-accent font-semibold hover:underline"
            >
              Forgot Password
            </a>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1 bg-accent font-semibold text-white py-2 px-4 rounded-xl !outline-none focus:ring-2 
           focus:ring-accent/50 transition-all"
          >
            Login {isLoading && <RiLoader2Fill className="animate-spin" />}
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <a
              href="/signup"
              className="text-accent font-semibold hover:underline"
            >
              Signup here
            </a>
          </div>
        </DevForm>
      </div>
      <div className=" bg-[url('/auth-bg.png')] bg-no-repeat bg-cover bg-start" />
    </section>
  );
};

export default Login;
