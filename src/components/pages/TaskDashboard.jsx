import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import CategorySidebar from "@/components/molecules/CategorySidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getAllCategories } from "@/services/api/categoryService";
import { getAllTasks } from "@/services/api/taskService";

const TaskDashboard = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isCompletedView = location.pathname === "/completed";
  const isArchivedView = location.pathname === "/archived";

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [categoriesData, tasksData] = await Promise.all([
        getAllCategories(),
        getAllTasks()
      ]);
      setCategories(categoriesData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDataChange = () => {
    loadData();
  };

  const getPageTitle = () => {
    if (isArchivedView) return "Archived Tasks";
    if (isCompletedView) return "Completed Tasks";
    if (categoryId) {
      const category = categories.find(c => c.Id.toString() === categoryId);
      return category ? `${category.name} Tasks` : "Category Tasks";
    }
    return "All Tasks";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CategorySidebar categories={categories} tasks={tasks} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        categories={categories}
        tasks={tasks}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <h1 className="text-lg font-display font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Page Header */}
            <div className="hidden lg:block mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600">
                  {isArchivedView 
                    ? "Review your completed and archived tasks"
                    : isCompletedView 
                    ? "Celebrate your completed tasks and track your progress"
                    : "Stay organized and boost your productivity"
                  }
                </p>
              </motion.div>
            </div>

            {/* Quick Add Bar - Only show for active tasks */}
            {!isCompletedView && !isArchivedView && (
              <QuickAddBar
                categories={categories}
                onTaskAdded={handleDataChange}
                selectedCategory={categoryId}
              />
            )}

            {/* Task List */}
            <TaskList
              categories={categories}
              selectedCategory={categoryId}
              showCompleted={isCompletedView}
              showArchived={isArchivedView}
              onTaskChange={handleDataChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;