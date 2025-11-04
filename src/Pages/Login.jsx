import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../i18n"; 
import { useTranslation } from "react-i18next";

const Login = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isadminLogin, setIsAdminLogin] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, register, Adminlogin } = useAuth();

  const resetState = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setLoading(false);
  };

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const credentials = {
      Email: email,
      Password: password,
    };
  
    const result = await Adminlogin(credentials);
  
    if (result === true) {
      resetState();
      navigate("/");
      return;
    }
  
    setError(result || "Login failed");
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const credentials = {
      Email: email,
      Password: password,
    };
  
    const result = await login(credentials);
  
    if (result === true) {
      resetState();
      navigate("/");
      return;
    }
  
    setError(result || "Login failed");
    setLoading(false);
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("Complete all fields");
      setLoading(false);
      return;
    }

    const result = await register({
         Name: name,
         Email: email,
         Password: password });
    if (!result) {
      setError("This email is already registered.");
      console.log(result);
      setLoading(false);
      return;
    }

    resetState();
    navigate("/");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {!isadminLogin? 
        <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">{t("Login.welcome")}</h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            {t("Login.subHeader")}
          </p>

          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab("signin");
                setError("");
              }}
              className={`flex-1 py-2 rounded-md transition ${
                activeTab === "signin"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {t("Login.login")}
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`flex-1 py-2 rounded-md transition ${
                activeTab === "signup"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {t("Login.newAccount")}
            </button>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 text-center">
              {error}
            </div>
          )}

          {activeTab == "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.email")}</label>
                <input
                  value={email}
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.password")}</label>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  type="password"
                  required
                  placeholder="**********"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md p-2 transition"
              >
                {loading ? t("Login.pleaseWait") : t("Login.login")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.name")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.email")}</label>
                <input
                  value={email}
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.password")}</label>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  type="password"
                  required
                  placeholder="**********"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md p-2 transition"
              >
                {loading ? t("Login.pleaseWait") : t("Login.register")}
              </button>
              
            </form>
          )}
         <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{t("Login.yourAdmin")} <span className="text-blue-500 dark:text-blue-400 cursor-pointer" onClick={() => setIsAdminLogin(true)}>{t("Login.loginHer")}</span> </p>
          
        </div>
        </div>
       :
        <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">{t("Login.welcome")}</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            {t("Login.logInToYourAccount")}
            </p>

            {error && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 text-center">
                {error}
                </div>
            )}

                <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.email")}</label>
                    <input
                    value={email}
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{t("Login.password")}</label>
                    <input
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                    type="password"
                    required
                    placeholder="**********"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md p-2 transition"
                >
                    {loading ? t("Login.pleaseWait") : t("Login.login")}
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("Login.yourNotAdmin")} <span className="text-blue-500 dark:text-blue-400 cursor-pointer" onClick={() => setIsAdminLogin(false)}>{t("Login.loginHer")}</span> </p>

                </form>
            </div>
        </div>
        }      
    </section>
  );
};

export default Login;
