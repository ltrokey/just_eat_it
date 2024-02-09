import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../../utils/mutations";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import auth from "../../utils/auth.js";

const RestaurantCard = ({ restaurant, favoritePage }) => {
  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);
  const [isFavorited, setIsFavorited] = useState(false);

  const imageUrl = restaurant.image || restaurant.image_url;
  const address =
    typeof restaurant.location === "object"
      ? restaurant.location.address1
      : restaurant.location;

  const bothId = restaurant.id || restaurant.businessId;

  const handleAddFavorite = async () => {
    const restaurantData = {
      businessId: bothId,
      name: restaurant.name,
      rating: restaurant.rating,
      image: imageUrl,
      url: restaurant.url,
      location: address,
    };

    console.log(restaurantData);
    console.log(restaurant);

    await addFavorite({ variables: { restaurantData: restaurantData } });
    setIsFavorited(true);
  };

  const handleRemoveFavorite = async () => {
    await removeFavorite({ variables: { businessId: bothId } });
    setIsFavorited(false);
  };

  return (
    <Card>
      <Card.Img variant="top" src={imageUrl} alt={restaurant.name} />
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Text>{restaurant.rating} ⭐️</Card.Text>
        <Card.Text>{address}</Card.Text>
      </Card.Body>
      {auth.loggedIn() && (
        <>
          {!favoritePage && (
            <Button className="favoriteBtn" onClick={handleAddFavorite}>
              {isFavorited ? "Added to Favorites!" : "Favorite"}
            </Button>
          )}
          {favoritePage && (
            <Button className="favoriteBtn" onClick={handleRemoveFavorite}>
              Remove Favorite
            </Button>
          )}
        </>
      )}
      <Card.Body>
        <a href={restaurant.url} target="_blank" rel="noopener noreferrer">
          View on Yelp for more details.
        </a>
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard;
