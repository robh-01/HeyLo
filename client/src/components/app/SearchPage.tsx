import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { searchUsers } from "@/utils/searchFunctions";
import UserSearchTile from "./UserSearchTile";

type SearchType = "user" | "group";

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [queryType, setQueryType] = useState<SearchType>("user");
  const [results, setResults] = useState<unknown[]>([]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!query) return;
    try {
      let searchResults: unknown[] = [];
      if (queryType === "user") {
        searchResults = await searchUsers(query);
      } else {
        // Implement group search logic here
        // searchResults = await searchGroups(query);
      }
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <div className="search-page-container">
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Page</h1>
        <form>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for group or user"
          />
          <label htmlFor="query-type">Search:</label>
          <select
            name="query-type"
            id="query-type"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as SearchType)}
          >
            <option value="user">User</option>
            <option value="group">Group</option>
          </select>
          <Button className="ml-2" onClick={handleSearch}>
            Search
          </Button>
        </form>
      </div>
      <div className="search-results mt-4">
        {results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                {queryType === "user" ? (
                  <UserSearchTile
                    user={result as { id: string; username: string }}
                  />
                ) : (
                  <div>{/* Render group search result here */}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
