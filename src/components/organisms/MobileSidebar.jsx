import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ isOpen, onClose, categories, tasks }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCategoryTaskCount = (categoryId) => {
    return tasks.filter(task => 
      task.categoryId === categoryId.toString() && 
      !task.completed && 
      !task.archived
    ).length;
  };

  const getCompletedTaskCount = () => {
    return tasks.filter(task => task.completed && !task.archived).length;
  };

  const getArchivedTaskCount = () => {
    return tasks.filter(task => task.archived).length;
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getCategoryIcon = (color) => {
    switch (color) {
      case "work": return "Briefcase";
      case "personal": return "User";
      case "shopping": return "ShoppingCart";
      case "health": return "Heart";
      default: return "Folder";
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    {
      name: "All Tasks",
      path: "/",
      icon: "Home",
      count: tasks.filter(task => !task.completed && !task.archived).length,
      active: isActiveRoute("/")
    },
    {
      name: "Completed",
      path: "/completed",
      icon: "CheckCircle2",
      count: getCompletedTaskCount(),
      active: isActiveRoute("/completed")
    },
    {
      name: "Archived",
      path: "/archived",
      icon: "Archive",
      count: getArchivedTaskCount(),
      active: isActiveRoute("/archived")
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Transform your productivity
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Main Navigation */}
              <div className="mb-8">
                <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h2>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        item.active
                          ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon
                          name={item.icon}
                          size={18}
                          className={item.active ? "text-white" : "text-gray-500 group-hover:text-primary-600"}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge
                        variant={item.active ? "default" : "primary"}
                        className={item.active ? "bg-white/20 text-white" : ""}
                      >
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </h2>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const taskCount = getCategoryTaskCount(category.Id);
                    const isActive = isActiveRoute(`/category/${category.Id}`);
                    
                    return (
                      <button
                        key={category.Id}
                        onClick={() => handleNavigation(`/category/${category.Id}`)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <ApperIcon
                            name={getCategoryIcon(category.color)}
                            size={18}
                            className={isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge
                          variant={isActive ? "default" : "primary"}
                          className={isActive ? "bg-white/20 text-white" : ""}
                        >
                          {taskCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Today's Progress</h3>
                <div className="text-2xl font-display font-bold text-primary-600 mb-1">
                  {getCompletedTaskCount()}
                </div>
                <div className="text-xs text-gray-600">
                  tasks completed today
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;