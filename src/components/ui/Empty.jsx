import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, actionText, onAction, icon = "CheckSquare" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary-600" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {title || "Ready to get productive?"}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description || "Create your first task and start organizing your day with TaskFlow's beautiful interface."}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-display font-semibold rounded-lg hover:from-primary-700 hover:to-accent-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {actionText || "Create Your First Task"}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;