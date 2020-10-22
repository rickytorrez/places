import React, { useState } from 'react';
import { useForm } from '../../shared/hooks/form-hook';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { 
  VALIDATOR_EMAIL, 
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,  
} from '../../shared/components/util/validators';
import './Auth.css';

const Auth = (props) => {

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    }
  }, false);

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  const switchModeHandler = () => {
    // sets the formData to bring it up-to-date with the available inputs
    // this runs before we switch the mode, if we're not in log in mode
    // we are in signup mode but since the switch mode handler executes and we're 
    // in that handler, it means we're now switching to login mode
    
    // this runs before we switch the mode
    // therefore => this is login mode
    if(!isLoginMode){
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        }, 
        formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    }

    // switch the mode
    setIsLoginMode(prevMode => !prevMode);
  };

  return (
    <Card className='authentication'>
      <h2>Login Required</h2>
      <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input 
            id='name'
            element='input'
            type='name'
            label='Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a name'
            onInput={inputHandler}
          />
        )}
        <Input 
          id='email'
          element='input'
          type='email'
          label='E-mail'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email'
          onInput={inputHandler}
        />
        <Input 
          id='password'
          element='input'
          type='password'
          label='Password'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a password that is at least five characters long'
          onInput={inputHandler}
        />
      <Button 
        type='submit'
        disabled={!formState.isValid}
      >
        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
      </Button>
      </form>
      <Button 
        inverse
        onClick={switchModeHandler}
      >
        SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
    </Card>
  );
};

export default Auth;