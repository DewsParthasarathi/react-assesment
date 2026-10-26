import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomCheckbox } from "../../components/ui/CustomCheckbox";
import { useLoginMutation } from "../../hooks/useLoginMutation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// 6x6 Decorative Dot Grid matching the reference screenshot exactly
const DotGrid: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    width="114"
    height="114"
    viewBox="0 0 114 114"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4, 5].map((row) =>
      [0, 1, 2, 3, 4, 5].map((col) => (
        <circle
          key={`${row}-${col}`}
          cx={7 + col * 20}
          cy={7 + row * 20}
          r="2.5"
          fill="#696cff"
        />
      )),
    )}
  </svg>
);

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const isLoading = loginMutation.isPending;

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Please enter your password";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormErrors({});

    if (!validate()) {
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email.trim().toLowerCase());
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          navigate("/dashboard");
        },
        onError: (error) => {
          setFormErrors({
            general:
              error.message || "Invalid email or password. Please try again.",
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f5f9] p-4 relative overflow-hidden select-none">
      {/* Centered Container with Background Dots and Card */}
      <div className="relative w-full max-w-[450px]">
        {/* Top-Right Decorative Dot Matrix */}
        <div className="absolute -top-9 -right-11 z-0 pointer-events-none">
          <DotGrid />
        </div>

        {/* Bottom-Left Decorative Dot Matrix */}
        <div className="absolute -bottom-9 -left-11 z-0 pointer-events-none">
          <DotGrid />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full bg-white rounded-lg shadow-[0_2px_14px_rgba(47,43,61,0.08)] p-8 sm:p-10">
          {/* Header */}
          <h1 className="text-fs22 font-bold text-[#32475c] mb-1.5">
            Welcome to  XYX
          </h1>
          <p className="text-fs14 text-[#6f6b7d] mb-6 leading-relaxed">
            Please  sign-in to your account and start the adventure
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <CustomInput
              id="login-email"
              type="email"
              placeholder="Email"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email || formErrors.general) {
                  setFormErrors((prev) => ({
                    ...prev,
                    email: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={formErrors.email}
              className="!h-[46px] !rounded-md !border-[#696cff] focus:!border-[#696cff] placeholder:!text-[#696cff] text-[#32475c]"
            />

            <CustomInput
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password || formErrors.general) {
                  setFormErrors((prev) => ({
                    ...prev,
                    password: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={formErrors.password}
              enablePasswordToggle
              className="!h-[46px] !rounded-md !border-[#dbdade] focus:!border-[#696cff] placeholder:!text-[#a5a3ae] text-[#32475c]"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <CustomCheckbox
                id="remember-me"
                label="Remember Me"
                checked={rememberMe}
                disabled={isLoading}
                onChange={(e) => setRememberMe(e.target.checked)}
                labelClassName="text-fs14 text-[#6f6b7d]"
              />

              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="text-fs14 text-[#696cff] hover:underline transition"
              >
                Forgot Password ?
              </a>
            </div>

            {/* General Error Message */}
            {formErrors.general && (
              <p className="text-fs13 text-red-500 text-center font-medium my-1">
                {formErrors.general}
              </p>
            )}

            {/* Sign In Button */}
            <CustomButton
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Signing in..."
              className="!h-[44px] !bg-[#696cff] hover:!bg-[#5f61e6] text-white font-semibold text-fs14 uppercase tracking-wider !rounded-md shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
            >
              SIGN IN
            </CustomButton>
          </form>

          {/* Create an account link */}
          <div className="text-center text-fs14 text-[#6f6b7d] mt-5 mb-4">
            <span>New on our platform ? </span>
            <a
              href="#create-account"
              onClick={(e) => e.preventDefault()}
              className="text-[#696cff] hover:underline font-normal transition"
            >
              Create an account
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-[#dbdade]"></div>
            <span className="px-3 text-fs14 text-[#6f6b7d]">or</span>
            <div className="flex-1 border-t border-[#dbdade]"></div>
          </div>

          {/* Social Login Buttons matching reference */}
          <div className="flex items-center justify-center gap-3.5">
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-[#497ce2]/40 flex items-center justify-center text-[#497ce2] hover:bg-[#497ce2]/5 transition cursor-pointer"
              aria-label="Sign in with Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-[#497ce2]" viewBox="0 0 24 24">
                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
              </svg>
            </button>

            <button
              type="button"
              className="w-8 h-8 rounded-full border border-[#1da1f2]/40 flex items-center justify-center text-[#1da1f2] hover:bg-[#1da1f2]/5 transition cursor-pointer"
              aria-label="Sign in with Twitter"
            >
              <svg className="w-4 h-4 fill-[#1da1f2]" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
              </svg>
            </button>

            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-[#24292e] hover:opacity-80 transition cursor-pointer"
              aria-label="Sign in with GitHub"
            >
              <svg className="w-6 h-6 fill-[#24292e]" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
