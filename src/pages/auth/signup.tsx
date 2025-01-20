import { useId, useState } from "react";
import {
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signUp,
} from "aws-amplify/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { DevForm, FormInput } from "../../components/dev-components/dev-form";
import { RiLoader2Fill } from "react-icons/ri";
import Logo from "../../components/global-cmp/logo";

const SignUp = () => {
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const bucketId = nanoid(8);

  const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: !showVerification ? "Password is required" : false,
      validate: (value: string) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        return null;
      },
    },

    verificationCode: {
      required: showVerification ? "Verification code is required" : false,
      pattern: {
        value: /^\d{6}$/,
        message: "Verification code must be 6 digits",
      },
    },
    terms: {
      required: showVerification
        ? false
        : "Please accept the terms and conditions",
    },
  };
  const handleResendCode = async (email: string) => {
    try {
      await resendSignUpCode({ username: email });
      toast.success("Verification code resent to your email!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to resend verification code");
        console.error(error);
      }
    }
  };

  const checkUserStatus = async (email: string, password: string) => {
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      return isSignedIn ? "CONFIRMED" : "UNCONFIRMED";
    } catch (error: any) {
      return "NOT_EXISTS";
    }
  };

  const handleInitialSignup = async (result: {
    values: Record<string, string | File | boolean> | null;
    errors: Record<string, string> | null;
  }) => {
    if (result.values) {
      const { email, password, terms } = result.values;

      if (!terms) {
        toast.error("Please accept the terms and conditions");
        return;
      }

      try {
        // Check user status first
        setLoading(true);
        const userStatus = await checkUserStatus(
          String(email),
          String(password)
        );
        if (userStatus === "UNCONFIRMED") {
          setUserEmail(String(email));
          setUserPassword(String(password));
          setShowVerification(true);
          await handleResendCode(String(email));
          return;
        } else if (userStatus === "CONFIRMED") {
          toast.error("User already exists. Please login.");
          return;
        }

        // If user doesn't exist, proceed with signup
        const signUpInput = {
          username: String(email),
          password: String(password),
          options: {
            userAttributes: {
              email: String(email),
              "custom:bucketId": bucketId,
            },
          },
        };

        const { nextStep } = await signUp(signUpInput);

        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          setUserEmail(String(email));
          setUserPassword(String(password));
          setShowVerification(true);
          toast.success("Verification code sent to your email!");
        }
      } catch (error: any) {
        console.error("Signup error:", error);
        toast.error(error.message || "An error occurred during sign up");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form errors:", result.errors);
    }
  };

  const handleVerification = async (result: {
    values: Record<string, string | File | boolean> | null;
    errors: Record<string, string> | null;
  }) => {
    if (result.values) {
      const { verificationCode } = result.values;

      try {
        setLoading(true);
        await confirmSignUp({
          username: userEmail,
          confirmationCode: String(verificationCode),
        });

        toast.success("Account verified successfully!");
        await signIn({ username: userEmail, password: userPassword });
        navigate("/dashboard");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred during verification");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="grid grid-rows-[30vh,1fr] h-screen w-full relative">
      <div></div>
      <div className="w-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border p-4 py-6 shadow">
        <Logo size="50px" />
        <br />
        <div>
          <div className="text-2xl">Hello User 👋</div>
          <div>Sign up to continue</div>
        </div>
        <br />
        <DevForm
          className="space-y-3"
          onSubmit={showVerification ? handleVerification : handleInitialSignup}
          validationRules={validationRules}
        >
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            classNames={{
              inputContainer: `${
                showVerification ? "pointer-events-none opacity-70" : ""
              }`,
            }}
          />
          {!showVerification && (
            <>
              <FormInput
                name="password"
                type="password"
                label="Password"
                classNames={{
                  inputContainer: `${
                    showVerification ? "pointer-events-none opacity-70" : ""
                  }`,
                }}
                placeholder="Enter password"
              />
              <FormInput
                name="terms"
                type="checkbox"
                label="For educational use only, no long-term data storage responsibility."
                classNames={{
                  mainContainer:
                    "flex  items-center gap-2 w-fit flex-row-reverse",
                  inputContainer: "!w-fit !rounded",
                }}
              />
            </>
          )}
          {showVerification && (
            <>
              <FormInput
                name="verificationCode"
                type="text"
                label="Verification Code"
                placeholder="Enter 6-digit code"
              />
              <button
                type="button"
                onClick={() => handleResendCode(userEmail)}
                className="text-sm text-accent hover:underline mt-2"
              >
                Resend verification code
              </button>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1 bg-accent font-semibold text-white py-2 px-4 rounded-xl !outline-none focus:ring-2 
           focus:ring-accent/50 transition-all"
          >
            {showVerification ? "Verify Account" : "Create Bucket"}
            {isLoading && <RiLoader2Fill className="animate-spin" />}
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <a
              href="/login"
              className="text-accent font-semibold hover:underline"
            >
              Login here
            </a>
          </div>
        </DevForm>
      </div>
      <div className=" bg-[url('/auth-bg.png')] bg-no-repeat bg-cover bg-start" />
    </section>
  );
};

export default SignUp;
