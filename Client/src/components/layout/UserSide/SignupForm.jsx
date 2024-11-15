import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { validateRegisterForm } from "../../../utils/validation/FormValidation";
import api from "../../../services/api/api";
import { setSignUpStatus, setUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { provider, auth } from "../../../services/firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
function SignupForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    cPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //handle continue with google
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await api.post("/users/google/auth", { idToken });
      const accessToken = res.data.accessToken;
      const data = {
        user: res.data._id,
        role: res.data.role,
        status: res.data.status,
        accessToken,
      };
      if (res.data.newUser) {
        dispatch(setSignUpStatus(true));
        navigate("/set-up", { replace: true });
        setTimeout(() => dispatch(setUser(data)), 100);
      } else {
        toast.success("Login Successfull");
        dispatch(setUser(data));
      }
    } catch (error) {
      // Handle Errors here.
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error email:", error.customData?.email);
      console.error("Error credential:", error.credential);
    }
  };

  /// handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      return setError(errors);
    }
    try {
      const res = await api.post("/users/checkuser", form);

      sessionStorage.setItem("x-timer", res.data.token);
      dispatch(setSignUpStatus(true));
      navigate("/send-otp", { replace: true });
    } catch (error) {
      const responseError = error?.response?.data?.message || error;
      setError({ ...errors, responseError });
    }
  };
  return (
    <>
      <div className="flex  bg-slate-50 min-h-full flex-1 flex-col justify-center px-6 py-12 pt-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark">
            Create account
          </h2>
        </div>

        <div className=" mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mb-14  text-center text-sm text-gray-500">
            Already have an Account?{" "}
            <Link
              to={"/login"}
              className="font-semibold leading-6 text-textPrimary hover:text-textPrimary/80 underline"
            >
              Login Here
            </Link>
          </p>
          <div
            className={`text-center font-primary font-semibold py-2 ${
              error.responseError
                ? "p-1 bg-red-100 border-red-300 border"
                : "p-1 bg-transparent"
            }`}
          >
            <p className="text-red-500 hover:text-red-700">
              {error.responseError ? error.responseError : ""}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="UserName"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleForm}
                  className="w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75"
                />
              </div>
              <div className="pt-2 font-tertiary">
                {error.username && (
                  <p className="text-red-500 hover:text-red-300">
                    {error.username}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleForm}
                  autoComplete="email"
                  className="w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75"
                />
              </div>
              <div className="pt-2 font-tertiary">
                {error.email && (
                  <p className="text-red-500 hover:text-red-300">
                    {error.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleForm}
                  autoComplete="tel"
                  className="w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75"
                />
              </div>
              <div className="pt-2 font-tertiary">
                {error.phone && (
                  <p className="text-red-500 hover:text-red-300">
                    {error.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleForm}
                  autoComplete="current-password"
                  className="w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75"
                />
              </div>
              <div className="pt-2 pb-1 text-base font-tertiary">
                {error.password && (
                  <p className="text-red-500 hover:text-red-300">
                    {error.password}
                  </p>
                )}
              </div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="rpassword"
                  name="cPassword"
                  type="password"
                  value={form.cPassword}
                  onChange={handleForm}
                  autoComplete="current-password"
                  className="w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75"
                />
              </div>
              <div className="pt-2 font-tertiary">
                {error.cPassword && (
                  <p className="text-red-500 hover:text-red-300">
                    {error.cPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex w-full sm:w-4/12 justify-center duration-300 bg-customColorTertiary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customColorTertiaryLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColorSecondary"
              >
                Sign in
              </button>
            </div>
            <div className="text-slate-950 mt-10 items-center grid-cols-3 grid">
              <hr className="text-slate-950" />
              <p className="text-center">OR</p>
              <hr className="text-slate-950" />
            </div>
            <div>
              <button
                className="bg-white border py-2 w-full mb-24 flex hover:bg-customColorSecondary duration-300"
                type="button"
                onClick={handleGoogleAuth}
              >
                <div className="mx-auto flex">
                  <FcGoogle className="text-3xl  opacity-70 " />{" "}
                  <p className=" font-tertiary  ms-5 font-semibold ">
                    Login With Google
                  </p>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
