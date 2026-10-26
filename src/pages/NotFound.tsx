import React from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export const NotFound: React.FC = () => {
  const error = useRouteError();
  let errorMessage =
    "The page you are looking for does not exist or has been moved.";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-page-bg text-foreground ">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-xs">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-muted text-danger font-bold text-fs24 mb-4 border border-danger/30 ">
          404
        </div>
        <h1 className="text-fs28 font-bold text-foreground">Page Not Found</h1>
        <p className="text-fs14 text-muted-foreground mt-2 mb-6">
          {errorMessage}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-fs14 font-medium text-background bg-primary hover:bg-primary-hover transition shadow-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
