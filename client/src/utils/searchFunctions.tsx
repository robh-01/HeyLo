async function searchUsers(query: string): Promise<unknown[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/search/${encodeURIComponent(
        query
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const responseData = await response.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

export { searchUsers };
