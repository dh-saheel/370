import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const VoteButtons = ({ reviewId, initialUp, initialDown }) => {
    const [vote, setVote] = useState(null); 
    const [counts, setCounts] = useState({ up: Number(initialUp), down: Number(initialDown) });

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // fetch the user's existing vote
    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        const fetchExistingVote = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/votes/reviews/${reviewId}/my-vote`, {
                    headers: { "Authorization": `Bearer ${token}`}
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.isLike === true) {
                        setVote("up");
                    } 
                    else if (data.isLike === false) {
                        setVote("down");
                    }
                }
            } catch (err) {
                console.error("Error fetching existing vote:", err);
            }
        };
        fetchExistingVote();
    }, [reviewId]);

    // direction is either up or down, checks user vote and updates counts accordingly 
    const handleVote = async (direction) => {
        try {
            await fetch(`http://localhost:5001/api/votes/reviews/${reviewId}/vote`, {
                method: 'POST',
                headers: { 
                    "Content-Type": 'application/json', 
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    isLike: direction === 'up',
                    isUndo: vote === direction
                })
            });

            if (vote === direction) {
                    setVote(null);
                    setCounts(prev => ({
                        ...prev,
                        [direction]: prev[direction] - 1
                    }));
                }
                else if (vote !== null) {
                    setCounts(prev => ({
                        ...prev,
                        [vote]: prev[vote] - 1,
                        [direction]: prev[direction] + 1
                    }));
                    setVote(direction);
                }
                else {
                    setCounts(prev => ({
                        ...prev,
                        [direction]: prev[direction] + 1
                    }));
                    setVote(direction);
            }
        } catch (err) {
            console.error("Error voting:", err);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => handleVote('up')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm
                ${vote === "up" 
                    ? "bg-[#7F77DD] text-white border-[#7F77DD]" 
                    : "text-gray-500 border-gray-200 hover:border-[#7F77DD] hover:text-[#7F77DD]"
                }`}
            >
                <ThumbsUp size={16}/>
                <span>{counts.up}</span>
            </button>
            <button onClick={() => handleVote('down')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm
                ${vote === "down" 
                    ? "bg-rose-500 text-white border-rose-500"
                    : "text-gray-500 border-gray-200 hover:border-rose-400 hover:text-rose-500"
                }`}
            >

                <ThumbsDown size={16}/>
                <span>{counts.down}</span>
            </button>
        </div>
    )
} 

export default VoteButtons;