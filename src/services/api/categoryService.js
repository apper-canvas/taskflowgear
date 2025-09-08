import categoryData from "@/services/mockData/categories.json";

let categories = [...categoryData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllCategories = async () => {
  await delay(200);
  return [...categories];
};

export const getCategoryById = async (id) => {
  await delay(200);
  const category = categories.find(c => c.Id === parseInt(id));
  if (!category) {
    throw new Error("Category not found");
  }
  return { ...category };
};

export const createCategory = async (categoryData) => {
  await delay(300);
  
  const newCategory = {
    ...categoryData,
    Id: Math.max(...categories.map(c => c.Id)) + 1
  };
  
  categories.push(newCategory);
  return { ...newCategory };
};

export const updateCategory = async (id, categoryData) => {
  await delay(250);
  
  const index = categories.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Category not found");
  }
  
  categories[index] = { ...categories[index], ...categoryData };
  return { ...categories[index] };
};

export const deleteCategory = async (id) => {
  await delay(250);
  
  const index = categories.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Category not found");
  }
  
  categories.splice(index, 1);
  return { success: true };
};