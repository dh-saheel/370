import { useState } from "react";
import { FaFlag, FaStar } from "react-icons/fa";
import ReviewModal from "./ReviewModal";
import VoteButtons from "./VoteButtons";

export default function ReviewEach({ review, onFlag, onUnflag }) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasAssignments = review.assignments && review.assignments !== "[@NA]" && review.assignments.trim() !== "";
  const hasExams = review.exams && review.exams !== "[@NA]" && review.exams.trim() !== "";
  const hasLabs = review.labs && review.labs !== "[@NA]" && review.labs.trim() !== "";

  const getDisplayContent = () => {
    if (hoveredSection === "assignments" && hasAssignments) return review.assignments;
    if (hoveredSection === "exams" && hasExams) return review.exams;
    if (hoveredSection === "labs" && hasLabs) return review.labs;
    return review.content;
  };

  const cardShadow = hoveredSection === "assignments"
    ? "shadow-[0_2px_10px_4px_rgba(99,103,255,0.4)]"
    : hoveredSection === "exams"
    ? "shadow-[0_2px_10px_4px_rgba(59,130,246,0.4)]"
    : hoveredSection === "labs"
    ? "shadow-[0_2px_10px_4px_rgba(47,164,215,0.4)]"
    : "shadow";

  return (
    <div>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`bg-white rounded-xl p-4 mb-5 cursor-pointer font-mono transition-shadow duration-150 ${cardShadow}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <strong>{review.title}</strong>
          </div>
          <FaFlag
            onClick={(e) => {
              /* Prevent entire card getting a clickEvent when flag is clicked 
                 The card's onClick event is the modal open event */
              e.stopPropagation();
              if (!review.flags || Number(review.flags) === 0) {
                onFlag(review.id);
              } else {
                onUnflag(review.id);
              }
            }}
            className={`cursor-pointer text-xl ${Number(review.flags || 0) > 0 ? "text-red-500" : "text-gray-400"}`}
            title="Flag this review"
          />
        </div>

        <p className="flex gap-2 mt-1 text-sm text-gray-500">
          {[...Array(review.rating)].map((_, i) => (
            <FaStar key={i} color="#FFD400" />
          ))}
        </p>

        <p className="mt-2 min-h-[40px]">{getDisplayContent()}</p>

        {/* Additional content buttons — only shows when content exists in each section 
            Check if at least one section has content if not ignore this whole section*/}
        {(hasAssignments || hasExams || hasLabs) && (
          <div className="flex gap-2 mt-3 flex-wrap text-white font-bold">
            {/* show assignments button if content exists */}
            {hasAssignments && (
              <AdditionalContentButton
                label="Assignments"
                baseClass="bg-[#6367FF] px-6 py-1 border-[#6367FF]"
                activeClass="bg-[#6367FF]/80"
                isActive={hoveredSection === "assignments"}
                /* hover events */
                onMouseEnter={() => setHoveredSection("assignments")}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
            {/* show exams button if content exists */}
            {hasExams && (
              <AdditionalContentButton
                label="Exams"
                baseClass="bg-[#3B82F6] px-6 py-1 border-[#3B82F6]"
                activeClass="bg-[#3B82F6]/80"
                isActive={hoveredSection === "exams"}
                /* hover events */
                onMouseEnter={() => setHoveredSection("exams")}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
            {/* show labs button if content exists */}
            {hasLabs && (
              <AdditionalContentButton
                label="Labs"
                baseClass="bg-[#2FA4D7] px-6 py-1 border-[#2FA4D7]"
                activeClass="bg-[#2FA4D7]/80"
                isActive={hoveredSection === "labs"}
                /* hover events */
                onMouseEnter={() => setHoveredSection("labs")}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
          </div>
        )}

        {/* Vote buttons */}
        <div className="mt-3 flex justify-end">
          <div onClick={(e) => e.stopPropagation()}>
            <VoteButtons
              reviewId={review.id}
              initialUp={review.upvotes ?? 0}
              initialDown={review.downvotes ?? 0}
            />
            {/* TODO: ADD A EXPAND/CLOSE COMMENT BUTTON HERE */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ReviewModal review={review} onClose={() => setIsModalOpen(false)} />
      )}
    {/* TODO: ADD A COMMENT CONTAINER HERE */}
    </div>
  );
}

function AdditionalContentButton({ label, baseClass, activeClass, isActive, onMouseEnter, onMouseLeave }) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
      className={`px-3 py-0.5 rounded-full border text-xs font-mono cursor-default transition-colors duration-150 ${baseClass} ${isActive ? activeClass : ""}`}
    >
      {label}
    </button>
  );
}