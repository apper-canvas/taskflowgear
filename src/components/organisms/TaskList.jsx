import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isToday, isTomorrow, isPast } from "date-fns";
import TaskItem from "@/components/molecules/TaskItem";
import SearchAndFilter from "@/components/molecules/SearchAndFilter";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getAllTasks } from "@/services/api/taskService";

const TaskList = ({ categories, selectedCategory, showCompleted = false, showArchived = false, onTaskChange }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: "",
    category: "",
    dueDate: ""
  });

  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by completion and archive status
    if (showArchived) {
      filtered = filtered.filter(task => task.archived);
    } else if (showCompleted) {
      filtered = filtered.filter(task => task.completed && !task.archived);
    } else {
      filtered = filtered.filter(task => !task.completed && !task.archived);
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory.toString());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter(task => task.categoryId === filters.category);
    }

    if (filters.dueDate) {
      const now = new Date();
      filtered = filtered.filter(task => {
        if (!task.dueDate) return filters.dueDate === "no-date";
        const dueDate = new Date(task.dueDate);
        
        switch (filters.dueDate) {
          case "today":
            return isToday(dueDate);
          case "tomorrow":
            return isTomorrow(dueDate);
          case "overdue":
            return isPast(dueDate) && !isToday(dueDate);
          case "no-date":
            return false;
          default:
            return true;
        }
      });
    }

    // Sort tasks by priority and due date
    return filtered.sort((a, b) => {
      // First by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, selectedCategory, showCompleted, showArchived, searchTerm, filters]);

  const handleTaskChange = () => {
    loadTasks();
    if (onTaskChange) onTaskChange();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  const getEmptyState = () => {
    if (showArchived) {
      return {
        title: "No archived tasks",
        description: "Tasks you archive will appear here for future reference.",
        icon: "Archive"
      };
    }
    if (showCompleted) {
      return {
        title: "No completed tasks yet",
        description: "Complete some tasks to see them here and track your productivity!",
        icon: "CheckCircle2"
      };
    }
    if (selectedCategory) {
      const category = categories.find(c => c.Id.toString() === selectedCategory.toString());
      return {
        title: `No ${category?.name.toLowerCase()} tasks`,
        description: `Create your first task in the ${category?.name} category to get started.`,
        icon: "FolderOpen"
      };
    }
    if (searchTerm || Object.values(filters).some(f => f !== "")) {
      return {
        title: "No matching tasks",
        description: "Try adjusting your search terms or filters to find what you're looking for.",
        icon: "Search"
      };
    }
    return {
      title: "Ready to get productive?",
      description: "Create your first task and start organizing your day with TaskFlow's beautiful interface.",
      icon: "CheckSquare"
    };
  };

  return (
    <div className="flex-1">
      <SearchAndFilter
        onSearch={setSearchTerm}
        onFilter={setFilters}
        categories={categories}
      />

      {filteredTasks.length === 0 ? (
        <Empty {...getEmptyState()} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-gray-900">
              {showArchived ? "Archived Tasks" : showCompleted ? "Completed Tasks" : "Active Tasks"}
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({filteredTasks.length})
              </span>
            </h2>
          </div>

          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <TaskItem
                  task={task}
                  categories={categories}
                  onTaskUpdated={handleTaskChange}
                  onTaskDeleted={handleTaskChange}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;