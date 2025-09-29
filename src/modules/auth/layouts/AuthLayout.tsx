import React, { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * AuthLayout Component
 *
 * Provides a consistent layout for authentication-related pages (e.g., Login, Register).
 * It centers the content vertically and horizontally, displays a logo and a title,
 * and ensures that the HTML and Body elements have the appropriate classes for full height and background color.
 *
 * **Usage:**
 * ```jsx
 * <AuthLayout title="Login">
 *   <SignInForm />
 * </AuthLayout>
 * ```
 *
 * @param {AuthLayoutProps} props - The properties passed to the component.
 * @param {string} props.title - The title to display above the children components.
 * @param {ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The rendered AuthLayout component.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <img
          alt="logo"
          src="/logo.png"
          className="mx-auto h-[150px] w-[150px]"
        />
        <h2 className="text-center text-2xl tracking-tight text-primary">
          {title}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
