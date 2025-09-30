import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction,
  icon = "FileX"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-secondary-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;