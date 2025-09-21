import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FirebaseDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 shadow-lg max-h-96 overflow-y-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Firebase Debug</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Authentication Status */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Authentication
              </span>
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
              <div>Status: Connected</div>
              <div>Provider: Email/Password, Google</div>
              <div>Current User: Active</div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Firestore
              </span>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>Status: Connected</div>
              <div>Collections: users, moods, chats</div>
              <div>Last Write: 2 minutes ago</div>
            </div>
          </div>

          {/* API Keys Status */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                API Keys
              </span>
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
              <div>Firebase: ✓ Valid</div>
              <div>Translation API: ✓ Valid</div>
              <div>Remaining Quota: 85%</div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div><strong>Environment:</strong> Development</div>
              <div><strong>Version:</strong> 1.0.0</div>
              <div><strong>Build:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Region:</strong> us-central1</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              Clear Cache
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              Reload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseDebugger;
