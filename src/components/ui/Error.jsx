import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}. Please try again or contact support if the problem persists.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center">
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;