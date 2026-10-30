import React from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import notFoundIllustration from "../assets/images/404.png";

export const NotFound: React.FC = () => {
  const error = useRouteError();
  let errorMessage = "Oops!  The requested URL was not found on this server.";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f9] p-4 sm:p-6 text-center select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#696cff]/5 via-[#696cff]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center py-8">
        <h1 className="text-fs28 sm:text-fs34 md:text-fs38 font-bold text-[#566a7f] tracking-tight leading-tight">
          Page Not Found :(
        </h1>
        <p className="text-fs14 sm:text-fs15 text-[#697a8d] mt-2 mb-6 max-w-md leading-relaxed">
          {errorMessage}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] text-fs14 font-medium text-white bg-[#696cff] hover:bg-[#5f61e6] active:bg-[#585ad7] shadow-[0_2px_6px_rgba(105,108,255,0.4)] hover:shadow-[0_4px_12px_rgba(105,108,255,0.5)] transition duration-150 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        {/* 404 Illustration */}
        <div className="mt-8 sm:mt-10 w-full flex justify-center items-center">
          <img
            src={notFoundIllustration}
            alt="404 Page Not Found"
            className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[580px] h-auto object-contain drop-shadow-sm select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
