import React from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/components/util/validators';
import { DUMMY_PLACES } from '../../fixtures/places';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const UpdatePlace = (props) => {
  const placeId = useParams().placeId;

  const identifiedPlace = DUMMY_PLACES.find((place) => placeId === place.id);

  const [formState, inputHandler] = useForm({
    title: {
      value: identifiedPlace.title,
      isValid: true
    },
    description: {
      value: identifiedPlace.description,
      isValid: true
    }
  }, true)

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault()
    // @TODO -> send request to the backend
    console.log(formState.inputs)
  }

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <h2>Could not find the place.</h2>
      </div>
    );
  }

  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        id='description'
        element='textarea'
        type='text'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (at least 5 characters).'
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialIsValid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
