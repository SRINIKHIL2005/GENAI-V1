import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GoogleCloudStatus: React.FC = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus("checking");
    
    try {
      // Simulate API check - in real app this would test Firebase/Google Cloud connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, randomly show connected/disconnected
      const isConnected = Math.random() > 0.3;
      setStatus(isConnected ? "connected" : "disconnected");
      setLastChecked(new Date());
    } catch (error) {
      setStatus("error");
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Checking connection...";
      case "connected":
        return "Google Cloud Connected";
      case "disconnected":
        return "Google Cloud Disconnected";
      case "error":
        return "Connection Error";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "checking":
        return "text-blue-600 dark:text-blue-400";
      case "connected":
        return "text-green-600 dark:text-green-400";
      case "disconnected":
        return "text-red-600 dark:text-red-400";
      case "error":
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            {getStatusIcon()}
            <span className={getStatusColor()}>{getStatusText()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : ""}
          </div>
          
          {status !== "checking" && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={checkConnection}
              className="w-full text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          )}
          
          {status === "connected" && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
              ✓ Translation services available
              <br />
              ✓ Firebase database connected
              <br />
              ✓ Authentication ready
            </div>
          )}
          
          {status === "disconnected" && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              ✗ Limited functionality
              <br />
              ✗ Offline mode active
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCloudStatus;
