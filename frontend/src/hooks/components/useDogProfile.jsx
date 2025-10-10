import { useEffect, useRef, useState } from "react";
import { useDogsContext } from "../context/useDogsContext";
import { useParams } from "react-router-dom";

const useDogProfile = () => {
  const [bottomPadding, setBottomPadding] = useState(0);
  const [selectedSponsors, setSelectedSponsors] = useState([]);

  const { dogs, loading } = useDogsContext();
  const menuRef = useRef(null);

  const { id } = useParams();

  const dog = dogs.find((d) => d.id === parseInt(id));

  const { name, imageUrl, sponsors, modified } = dog || {};

  useEffect(() => {
    if (menuRef.current) {
      setBottomPadding(menuRef.current.offsetHeight + 10);
    }
  }, [sponsors]);

  return {
    loading,
    bottomPadding,
    selectedSponsors,
    setSelectedSponsors,
    dog,
    name,
    imageUrl,
    sponsors,
    modified,
  };
};

export default useDogProfile;
