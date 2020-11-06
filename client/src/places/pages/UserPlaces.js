import React from 'react';
import { useParams } from 'react-router-dom';

import { DUMMY_PLACES } from '../../fixtures/places';
import PlaceList from '../components/PlaceList';

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => {
    return place.creator === userId;
  });
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;