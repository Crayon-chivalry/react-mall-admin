import ErrorPage from "@/components/ErrorPage";

const Forbidden = () => {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      desc="Your account does not have permission to access this page."
      theme="danger"
    />
  );
};

export default Forbidden;
