import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import VoteButtons from "./VoteButtons";

export default function ReviewModal({ review, onClose }) {
  /* Close on Escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasAssignments = review.assignments && review.assignments !== "[@NA]" && review.assignments.trim() !== "";
  const hasExams = review.exams && review.exams !== "[@NA]" && review.exams.trim() !== "";
  const hasLabs = review.labs && review.labs !== "[@NA]" && review.labs.trim() !== "";

  return (
    /* Backdrop — clicking it closes the modal */
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center"
    >
      {/* Modal panel — stop propagation so clicks inside don't close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl p-8 w-[620px] max-w-[90vw] max-h-[80vh] overflow-y-auto font-mono shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          title="Close (Esc)"
          className="absolute top-3 right-4 bg-transparent border-none text-xl cursor-pointer leading-none text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="mt-0 mr-8">{review.title}</h2>
        <p className="text-xs text-gray-400 mt-2 mb-3">
          {review.reviewer_username} &middot; {new Date(review.created_at).toLocaleDateString()}
        </p>

        {/* Star rating */}
        <p className="flex gap-2 mb-5 text-gray-500 text-sm">
          {[...Array(review.rating)].map((_, i) => (
            <FaStar key={i} color="#FFD400" />
          ))}
        </p>

        {/* General content */}
        <Section label="Review" content={review.content} />

        {/* Additional sections — only when content exists */}
        {hasAssignments && (
          <Section
            label="Assignments"
            content={review.assignments}
            bgClass="bg-[#6367FF]/10"
            labelClass="text-[#6367FF]"
          />
        )}
        {hasExams && (
          <Section
            label="Exams"
            content={review.exams}
            bgClass="bg-[#3B82F6]/10"
            labelClass="text-[#3B82F6]"
          />
        )}
        {hasLabs && (
          <Section
            label="Labs"
            content={review.labs}
            bgClass="bg-[#2FA4D7]/10"
            labelClass="text-[#2FA4D7]"
          />
        )}

        {/* Vote buttons */}
        <div className="flex justify-end mt-5">
          <VoteButtons
            reviewId={review.id}
            initialUp={review.upvotes ?? 0}
            initialDown={review.downvotes ?? 0}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ label, content, bgClass = "", labelClass = "text-gray-600" }) {
  return (
    <div className={`rounded-lg mb-3 ${bgClass ? `${bgClass} p-3` : "pb-4"}`}>
      <p className={`mb-1 uppercase text-[11px] font-bold tracking-wide ${labelClass}`}>
        {label}
      </p>
      <p className="m-0">{content}</p>
    </div>
  );
}
