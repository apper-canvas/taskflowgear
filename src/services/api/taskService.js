import taskData from "@/services/mockData/tasks.json";

let tasks = [...taskData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTaskDescription = async (title) => {
  try {
    const response = await fetch(`https://test-api.apper.io/fn/1e117f97088e47f0a4469d4a80f31a62/generate-task-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate description');
    }
    
    return data.description;
  } catch (error) {
    console.error('Description generation error:', error);
    throw error;
  }
};
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