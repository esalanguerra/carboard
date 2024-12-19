import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/signin");
      }
    }, [loading, user, router]);

    if (loading) {
      return <p>Carregando...</p>;
    }

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
