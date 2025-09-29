// import reactLogo from '@/assets/react.svg'
import "@/App.css";
import MainLayout from "../layouts/MainLayout";

/**
 * HomePage Component
 *
 * This component serves as the landing page of the application.
 * It displays logos, a counter button, and a list of todos fetched from an external API.
 *
 * @returns {React.JSX.Element} The rendered HomePage component.
 */
function HomePage(): React.JSX.Element {
  return (
    <MainLayout>
      <h1 className="text-primary text-2xl">home page</h1>
    </MainLayout>
  );
}

export default HomePage;
