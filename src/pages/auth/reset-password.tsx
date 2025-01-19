import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DevButton from "../../components/dev-components/dev-button";
import { useEffect } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import { DevForm, FormInput } from "../../components/dev-components/dev-form";

const validationRules = {
  code: {
    required: "Verification code is required",
    pattern: {
      value: /^\d{6}$/,
      message: "Code must be 6 digits",
    },
  },
  newPassword: {
    required: "Password is required",
    validate: (value: string) => {
      if (value.length < 8) {
        return "Password must be at least 8 characters";
      }

      return null;
    },
  },
  confirmPassword: {
    required: "Confirm Password is required",
    validate: (value: string, allValues: Record<string, string>) => {
      if (value !== allValues.newPassword) {
        return "Passwords do not match";
      }
      return null;
    },
  },
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetPasswordEmail");

  useEffect(() => {
    if (!email) {
      toast.error("Please initiate password reset first");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (result: {
    values: Record<string, string | File | boolean> | null;
    errors: Record<string, string> | null;
  }) => {
    if (!email) {
      toast.error("Missing required information");
      navigate("/forgot-password");
      return;
    }

    if (result.values) {
      const { newPassword, code } = result.values;

      try {
        await confirmResetPassword({
          username: email,
          confirmationCode: String(code),
          newPassword: String(newPassword),
        });

        // Clear stored reset data
        sessionStorage.removeItem("resetPasswordEmail");

        toast.success("Password reset successful");
        navigate("/reset-success");
      } catch (error) {
        if (error instanceof Error) {
          switch (error.name) {
            case "CodeMismatchException":
              toast.error("Invalid verification code");
              break;
            case "ExpiredCodeException":
              toast.error(
                "Verification code has expired, please request a new one"
              );
              navigate("/forgot-password");
              break;
            case "InvalidPasswordException":
              toast.error("Password does not meet requirements");
              break;
            default:
              toast.error(error.message);
          }
        } else {
          toast.error("An error occurred during password reset");
          console.error("Reset password error:", error);
        }
      }
    } else {
      console.log("Form errors:", result.errors);
    }
  };

  if (!email) {
    return null; // Prevent flash of content before redirect
  }

  return (
    <section className="grid grid-cols-2 h-screen w-full relative">
      <div className=" bg-[url('/auth-bg.png')] bg-no-repeat bg-cover bg-right-bottom" />

      <div className="w-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border p-4 py-6 shadow">
        <div>
          <h2 className="text-2xl">Reset Password</h2>
          <p>
            Enter the verification code sent to your email and your new
            password.
          </p>
          <p className="text-sm text-gray-600">
            Resetting password for: {email}
          </p>
        </div>
        <br />
        <DevForm onSubmit={handleSubmit} validationRules={validationRules}>
          <FormInput
            name="code"
            type="text"
            label="Verification Code"
            placeholder="Enter 6-digit code"
          />
          <FormInput
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="Enter your new password"
          />
          <FormInput
            name="confirmPassword"
            type="password"
            label="Re-Enter Password"
            placeholder="Re-enter your new password"
          />
          <DevButton type="submit" className="w-full">
            Reset Password
          </DevButton>
        </DevForm>
        <div className="grid place-items-center">
          <a
            href="/forgot-password"
            className="text-sm mt-4 text-center text-accent font-semibold hover:underline"
          >
            Request New Code
          </a>
        </div>
      </div>
      <div className=" bg-[url('/auth-bg.png')] bg-no-repeat bg-cover bg-left-bottom" />
    </section>
  );
};

export default ResetPassword;
