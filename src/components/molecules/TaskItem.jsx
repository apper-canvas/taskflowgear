import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, isToday, isPast, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { updateTask, deleteTask } from "@/services/api/taskService";

const TaskItem = ({ task, categories, onTaskUpdated, onTaskDeleted }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const category = categories.find(c => c.Id.toString() === task.categoryId);
  
  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed
      };
      
      await updateTask(task.Id, updatedTask);
      
      if (!task.completed) {
        toast.success("🎉 Task completed!");
      } else {
        toast.success("Task reopened");
      }
      
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.Id);
      toast.success("Task deleted");
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "priority-medium";
    }
  };

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return { text: "Today", color: "text-accent-600", urgent: true };
    if (isTomorrow(date)) return { text: "Tomorrow", color: "text-blue-600", urgent: false };
    if (isPast(date)) return { text: "Overdue", color: "text-red-600", urgent: true };
    return { text: format(date, "MMM d"), color: "text-gray-600", urgent: false };
  };

  const dueDateInfo = getDueDateDisplay(task.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.01 }}
      className={`p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
        task.completed ? "task-completion-animation" : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className={isCompleting ? "animate-pulse" : ""}
          />
        </div>

<div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`text-base font-medium leading-6 ${
              task.completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 p-1 -mt-1"
            >
              {isDeleting ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="Trash2" size={16} />
              )}
            </Button>
          </div>

          {task.description && (
            <p className={`mt-1 text-sm leading-5 ${
              task.completed ? "text-gray-400" : "text-gray-600"
            }`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center space-x-3">
            {category && (
              <Badge
                variant="primary"
                className={`category-border-${category.color} px-2 py-1 text-xs`}
              >
                {category.name}
              </Badge>
            )}
<div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
            
            {task.color && (
              <div className={`w-3 h-3 rounded-full color-${task.color}`} />
            )}
            <span className="text-xs text-gray-500 capitalize">
              {task.priority} priority
            </span>

            {dueDateInfo && (
              <div className={`flex items-center space-x-1 text-xs ${dueDateInfo.color}`}>
                <ApperIcon name="Calendar" size={12} />
                <span className={dueDateInfo.urgent ? "font-medium" : ""}>
                  {dueDateInfo.text}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;