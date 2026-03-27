import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchResults() {
        try {
            setLoading(true);
            setError("");

            let url = `${import.meta.env.VITE_API_URL}/api/reviews`;

            if (query.trim() !== "") {
                url += `?search=${encodeURIComponent(query)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("Could not load search results.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Search Results</h1>

                <p className="mb-6 text-gray-700">
                    {query ? (
                        <>
                            Showing results for: <strong>{query}</strong>
                        </>
                    ) : (
                        "No search term entered."
                    )}
                </p>

                {loading && <p>Loading...</p>}

                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && results.length === 0 && (
                    <p>No results found.</p>
                )}

                <div className="space-y-4">
                    {results.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-xl shadow p-5 border"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {review.title}
                            </h2>

                            <p className="text-sm text-gray-600 mb-2">
                                {review.course_code} - {review.course_name}
                            </p>

                            <p className="text-sm text-gray-600 mb-2">
                                Professor: {review.professor_name}
                            </p>

                            <p className="text-sm text-gray-600 mb-3">
                                Rating: {review.rating}/5
                            </p>

                            <p className="text-gray-800">{review.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResultsPage;