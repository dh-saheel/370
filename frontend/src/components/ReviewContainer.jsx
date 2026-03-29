import ReviewEach from "./ReviewEach"

export default function ReviewContainer({ reviewList, onFlag, onUnflag }) {

  return (
    <div className="max-w-6xl mx-auto">
      {reviewList.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No reviews yet. Be the first to review this course!</p>
      ) : (
        reviewList.map((review) => (
          <ReviewEach key={review.id} review={review} onFlag={onFlag} onUnflag={onUnflag} />
        ))
      )}
    </div>
  );
}