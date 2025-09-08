import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        ref={ref}
        checked={checked}
        {...props}
      />
      <div
        className={cn(
          "w-5 h-5 rounded border-2 border-gray-300 bg-white flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-110",
          checked && "bg-gradient-to-r from-primary-600 to-accent-500 border-primary-600",
          className
        )}
        onClick={() => props.onChange && props.onChange({ target: { checked: !checked } })}
      >
        {checked && (
          <ApperIcon name="Check" size={12} className="text-white" />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;