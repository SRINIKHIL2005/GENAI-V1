import React from "react";
import EnhancedAuth from "./EnhancedAuth";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative">
      <EnhancedAuth 
        onBack={() => navigate(-1)}
        onSuccess={() => navigate("/", { replace: true })}
      />
    </div>
  );
};

export default AuthPage;
