import ErrorPage from "@/components/ErrorPage";

const NotFound = () => {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      desc="The page you are looking for does not exist or has been moved."
      imageSrc="/src/assets/images/404.png"
      imageAlt="404"
      theme="info"
    />
  );
};

export default NotFound;
