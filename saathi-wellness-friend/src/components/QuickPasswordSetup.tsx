import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WellnessHeader from "@/components/WellnessHeader";

const QuickPasswordSetup: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    
    // Simulate password setup
    setTimeout(() => {
      setIsSetup(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WellnessHeader title="Password Setup" />
      
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-blue-500" />
              <span>Quick Password Setup</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {isSetup 
                ? "Your password has been set successfully!"
                : "Set up a secure password for your account."
              }
            </p>
          </CardHeader>

          <CardContent>
            {!isSetup ? (
              <form onSubmit={handleSetupPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p className={password.length >= 6 ? "text-green-600" : ""}>
                    ✓ At least 6 characters
                  </p>
                  <p className={password !== confirmPassword ? "text-red-600" : password && confirmPassword ? "text-green-600" : ""}>
                    ✓ Passwords match
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={loading || password.length < 6 || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? "Setting up..." : "Set Password"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Password Set Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account is now secured with a password. You can now access all features.
                </p>
                <Button 
                  onClick={() => setIsSetup(false)}
                  variant="outline"
                  className="w-full"
                >
                  Change Password
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickPasswordSetup;
