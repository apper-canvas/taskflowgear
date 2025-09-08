import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { createTask, generateTaskDescription } from "@/services/api/taskService";
const QuickAddBar = ({ categories, onTaskAdded, selectedCategory }) => {
  const [title, setTitle] = useState("");
const [categoryId, setCategoryId] = useState(selectedCategory || "");
const [priority, setPriority] = useState("medium");
  const [color, setColor] = useState("blue");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

setIsLoading(true);
    try {
      const newTask = {
title: title.trim(),
        description: description.trim() || null,
        categoryId: categoryId || categories[0]?.Id.toString(),
        priority,
        dueDate: dueDate || null,
completed: false,
        color,
        archived: false,
        createdAt: new Date().toISOString()
      };

      await createTask(newTask);
      setTitle("");
      setCategoryId(selectedCategory || "");
setPriority("medium");
setDueDate("");
      setColor("blue");
      setDescription("");
      setIsExpanded(false);
      toast.success("Task created successfully!");
      if (onTaskAdded) onTaskAdded();
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title first");
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const generatedDescription = await generateTaskDescription(title.trim());
      setDescription(generatedDescription);
      toast.success("Description generated successfully!");
    } catch (error) {
      toast.error("Failed to generate description. Please try again.");
      console.error('Description generation error:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-lg mb-6"
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="text-lg font-medium border-0 bg-transparent focus:ring-0 focus:border-0 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "Settings"} 
              size={18} 
              className="text-gray-500" 
            />
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!title.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Plus" size={16} />
            )}
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading}
                >
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  disabled={isLoading}
                />
              </div>
</div>

            {/* Color Picker */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex items-center space-x-2">
                {[
                  { value: "blue", class: "color-blue" },
                  { value: "green", class: "color-green" },
                  { value: "yellow", class: "color-yellow" },
                  { value: "red", class: "color-red" },
                  { value: "purple", class: "color-purple" },
                  { value: "pink", class: "color-pink" },
                  { value: "indigo", class: "color-indigo" },
                  { value: "gray", class: "color-gray" }
                ].map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setColor(colorOption.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${colorOption.class} ${
                      color === colorOption.value
                        ? "border-gray-900 ring-2 ring-gray-300"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

            <div>
<div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isLoading || isGeneratingDescription || !title.trim()}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  title="Generate description with AI"
                >
                  <ApperIcon 
                    name={isGeneratingDescription ? "Loader2" : "Sparkles"} 
                    size={12}
                    className={isGeneratingDescription ? "animate-spin" : ""}
                  />
                  {isGeneratingDescription ? "Generating..." : "Generate with AI"}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your task (optional) or generate one with AI..."
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none disabled:opacity-50"
                disabled={isLoading || isGeneratingDescription}
              />
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAddBar;