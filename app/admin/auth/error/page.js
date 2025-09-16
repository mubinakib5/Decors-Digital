"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const getErrorMessage = (error) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There is a problem with the server configuration. Please contact the administrator.",
          details: "The authentication system is not properly configured."
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You do not have permission to sign in.",
          details: "Your account may not have the required permissions."
        };
      case "Verification":
        return {
          title: "Verification Error",
          message: "The verification token has expired or is invalid.",
          details: "Please request a new verification link."
        };
      case "Default":
      default:
        return {
          title: "Authentication Error",
          message: "An error occurred during authentication.",
          details: "Please try signing in again or contact support if the problem persists."
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {errorInfo.title}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {errorInfo.message}
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              {errorInfo.details}
            </p>

            {error && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600">
                  <strong>Error Code:</strong> {error}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/admin/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we load the error details.
              </p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}