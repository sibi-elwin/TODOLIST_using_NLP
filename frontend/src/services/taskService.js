import axios from 'axios';

export const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/api/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 