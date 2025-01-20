import { useNavigate } from 'react-router-dom';
import { resetPassword } from 'aws-amplify/auth';
import {toast } from 'sonner'
import DevButton from '../../components/dev-components/dev-button';
import { DevForm, FormInput } from '../../components/dev-components/dev-form';
import Logo from '../../components/global-cmp/logo';

const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = async (result: {
    values: Record<string, string | File | boolean> | null;
    errors: Record<string, string> | null;
  }) => {
    if (result.values) {
      const emailValue = String(result.values.email);

      try {
        const { nextStep } = await resetPassword({
          username: emailValue
        });

        if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
          // Store email and navigate to reset password page
          sessionStorage.setItem('resetPasswordEmail', emailValue);
          toast.success('Verification code sent to your email');
          navigate('/reset-password');
        }
      } catch (error) {
        if (error instanceof Error) {
          switch (error.name) {
            case 'UserNotFoundException':
              toast.error('No account found with this email address');
              break;
            case 'LimitExceededException':
              toast.error('Too many attempts. Please try again later');
              break;
            default:
              toast.error(error.message);
          }
        } else {
          toast.error('An error occurred. Please try again');
          console.error('Reset password error:', error);
        }
      }
    } else {
      console.log("Form errors:", result.errors);
    }
  };

  return (
    <section className="grid grid-cols-2 h-screen w-full relative">
 <div className=" bg-[url('/auth-bg.png')] bg-no-repeat bg-cover bg-right-bottom"/>
    <div className="w-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border p-4 py-6 shadow">
    <Logo size="50px"/>
      <br />
      <div>
        <h2 className="text-2xl">Forgot Password</h2>
        <p>Submit your email address and we'll send you a code to reset your
        password.</p>
        
      </div>
      <br />
      <DevForm
          onSubmit={handleSubmit}
          validationRules={validationRules}
        >
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your Email ID"
          />

          <DevButton
            className="w-full"
            type="submit"
          >
            Send Reset Code
          </DevButton>
        </DevForm>
        <div className='grid place-items-center'>
        <a
          href="/login"
          className="text-sm mt-4 text-center text-accent font-semibold hover:underline"
        >
          Go back to Login
        </a>
        </div>
    </div>
  </section>
  
  );
};

export default ForgotPassword;