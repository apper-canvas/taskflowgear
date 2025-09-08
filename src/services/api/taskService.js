import taskData from "@/services/mockData/tasks.json";

let tasks = [...taskData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTasks = async () => {
  await delay(300);
  return [...tasks];
};

export const getTaskById = async (id) => {
  await delay(200);
  const task = tasks.find(t => t.Id === parseInt(id));
  if (!task) {
    throw new Error("Task not found");
  }
  return { ...task };
};

export const createTask = async (taskData) => {
  await delay(400);
  
  const newTask = {
    ...taskData,
    Id: Math.max(...tasks.map(t => t.Id)) + 1,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  return { ...newTask };
};

export const updateTask = async (id, taskData) => {
  await delay(300);
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }
  
  tasks[index] = { ...tasks[index], ...taskData };
  return { ...tasks[index] };
};

export const deleteTask = async (id) => {
  await delay(250);
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }
  
  tasks.splice(index, 1);
  return { success: true };
};