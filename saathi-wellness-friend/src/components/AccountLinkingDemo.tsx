import React, { useState } from "react";
import { Link2, CheckCircle, AlertCircle, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WellnessHeader from "@/components/WellnessHeader";

const AccountLinkingDemo: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate linking process
    setTimeout(() => {
      setIsLinked(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WellnessHeader title="Account Linking" />
      
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link2 className="h-6 w-6 text-blue-500" />
              <span>Link Additional Account</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Connect additional email accounts to access your wellness data across platforms.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isLinked ? (
              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email to link"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? "Linking Account..." : "Link Account"}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Account Successfully Linked!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your account has been linked. You can now access your wellness data from this email.
                </p>
                <Button 
                  onClick={() => setIsLinked(false)}
                  variant="outline"
                >
                  Link Another Account
                </Button>
              </div>
            )}

            {/* Current Linked Accounts */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Linked Accounts</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        primary@example.com
                      </p>
                      <p className="text-xs text-gray-500">Primary Account</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                {isLinked && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {email}
                        </p>
                        <p className="text-xs text-gray-500">Recently Linked</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Account Linking Benefits
                  </h5>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Access your data from multiple devices</li>
                    <li>• Backup your wellness information</li>
                    <li>• Share data with healthcare providers</li>
                    <li>• Seamless experience across platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountLinkingDemo;
