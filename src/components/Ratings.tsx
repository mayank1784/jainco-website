interface StarRatingProps {
    rating: number; // The rating value, e.g., 4.5
    totalReviews: number; // Total number of reviews, e.g., 120
  }
  
  const StarRating: React.FC<StarRatingProps> = ({ rating, totalReviews }) => {
    // const totalStars = 5;
  
    // // Determine full, half, and empty stars based on the rating value
    // const fullStars = Math.floor(rating); // Number of full stars
    // const hasHalfStar = rating % 1 !== 0; // True if there's a half star
    // const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div className="flex items-center mb-4">
           <div
      className="Stars"
      style={{ '--rating': rating } as React.CSSProperties}
      aria-label={`Rating of this product is ${rating} out of 5`}
    ></div>
        {/* Render full stars */}
        {/* {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`full-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          ))}
  
        {hasHalfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-yellow-500"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 0 1 .694.472l2.082 5.006 5.404.434a.75.75 0 0 1 .435 1.316l-4.117 3.527 1.257 5.273a.75.75 0 0 1-1.14.82L12 18.354l-4.616 2.827a.75.75 0 0 1-1.14-.82l1.257-5.273-4.117-3.527a.75.75 0 0 1 .435-1.316l5.404-.434 2.082-5.006A.75.75 0 0 1 12 2.25Zm0 3.708-1.545 3.716a.75.75 0 0 1-.65.455l-4.057.326 3.09 2.645a.75.75 0 0 1 .238.725l-.94 3.943 3.364-2.059a.75.75 0 0 1 .772 0l3.364 2.059-.94-3.943a.75.75 0 0 1 .238-.725l3.09-2.645-4.057-.326a.75.75 0 0 1-.65-.455L12 5.958Z"
              clipRule="evenodd"
            />
          </svg>
        )}
  
      
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2.25a.75.75 0 0 1 .694.472l2.082 5.006 5.404.434a.75.75 0 0 1 .435 1.316l-4.117 3.527 1.257 5.273a.75.75 0 0 1-1.14.82L12 18.354l-4.616 2.827a.75.75 0 0 1-1.14-.82l1.257-5.273-4.117-3.527a.75.75 0 0 1 .435-1.316l5.404-.434 2.082-5.006A.75.75 0 0 1 12 2.25Z"
              />
            </svg>
          ))} */}
  
        <span className="ml-2 text-gray-600">
          {rating} ({totalReviews} reviews)
        </span>
      </div>
    );
  };
  
  export default StarRating;
  