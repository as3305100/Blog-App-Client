import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Logo, Input, Button } from "./index.js";
import { createAccount } from "../services/user.js";
import { login } from "../store/slices/authSlice.js";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    const formData = new FormData();

    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    const response = await createAccount(formData, {
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      dispatch(login(response.data));
      reset()
      navigate("/");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="70px" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60 mb-3">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {!!error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${Object.keys(errors).length === 0 ? "space-y-5" : "space-y-2"} mt-5`}>
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("fullname", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Fullname must be at least 3 characters",
                },
                maxLength: {
                  value: 60,
                  message: "Fullname not more than 60 characters",
                },
              })}
            />
            {!!errors.fullname && (
              <p className="text-red-600 pl-2">{errors.fullname.message}</p>
            )}
            <Input
              label="Email: "
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
                maxLength: {
                  value: 320,
                  message: "Email must not exceed 320 characters",
                },
              })}
            />
            {!!errors.email && (
              <p className="text-red-600 pl-2">{errors.email.message}</p>
            )}
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 60,
                  message: "Password must not exceed 60 characters",
                },
              })}
            />
            {!!errors.password && (
              <p className="text-red-600 pl-2">{errors.password.message}</p>
            )}
            <Input
              label="Avatar: "
              type="file"
              placeholder="Add your avatar"
              accept="image/png image/jpg image/jpeg"
              {...register("avatar", {
                required: "Avatar image is required",
                validate: {
                  isImage: (value) =>
                    value?.[0]?.type.startsWith("image/") ||
                    "Only image files are allowed",
                  maxSize: (value) =>
                    value?.[0]?.size <= 5 * 1024 * 1024 ||
                    "Image must be less than 5MB",
                },
              })}
            />
            {!!errors.avatar && (
              <p className="text-red-600 pl-2">{errors.avatar.message}</p>
            )}
            <Button
              type="submit"
              className="w-full disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
