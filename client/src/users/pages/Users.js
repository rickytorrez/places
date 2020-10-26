import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      image:
        'https://www.gaithersburgmd.gov/Home/ShowPublishedImage/3676/636975902007830000',
      name: 'Ricky Torrez',
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
