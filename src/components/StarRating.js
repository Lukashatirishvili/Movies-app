import { useState } from "react";
import { useMovieContext } from "../context/MoviesContext";

export default function StarRating() {
  const starArr = Array.from({ length: 10 });
  const { userRating } = useMovieContext();

  const [tempRating, setTempRating] = useState(0);

  return (
    <div className="ratingSection">
      <div className="starSection" onMouseOut={() => setTempRating(0)}>
        {starArr.map((star, i) => (
          <Star
            full={tempRating ? tempRating >= i + 1 : userRating >= i + 1}
            setTempRating={setTempRating}
            i={i}
            key={i}
          />
        ))}
      </div>
      <div className="message">
        <span>{tempRating ? tempRating : userRating}</span>
      </div>
    </div>
  );
}

function Star({ i, setTempRating, full }) {
  const { handleUserRating } = useMovieContext();
  return (
    <div>
      <span
        onClick={() => handleUserRating(i + 1)}
        className="star"
        onMouseOver={() => setTempRating(i + 1)}
      >
        {full ? (
          <ion-icon style={{ color: "#6741d9" }} name="star"></ion-icon>
        ) : (
          <ion-icon style={{ color: "grey" }} name="star-outline"></ion-icon>
        )}
      </span>
    </div>
  );
}
