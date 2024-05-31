const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const fetchApi = async () => {
  const response = await fetch(`${API_URL}/api/something`);
  const data = await response.json();
  return data;
};
