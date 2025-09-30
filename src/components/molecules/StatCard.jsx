import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  className 
}) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 mb-2">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-secondary-900 bg-gradient-to-r bg-clip-text text-transparent from-secondary-900 to-secondary-700">
                {value}
              </h3>
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend === "up" ? "text-success-600" : "text-error-500"
                )}>
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                    className="w-3 h-3 mr-1" 
                  />
                  {trendValue}
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            colors[color]
          )}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;