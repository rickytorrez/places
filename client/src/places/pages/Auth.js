import React, { useState, useContext } from 'react';
import { useForm } from '../../shared/hooks/form-hook';

import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/components/util/validators';
import './Auth.css';

const Auth = (props) => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const authSubmitHandler = async (event) => {
		event.preventDefault();
		if (isLoginMode) {
		} else {
			try {
				setIsLoading(true);
				const response = await fetch('http://localhost:5000/api/users/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				});

				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message);
				}
				console.log(responseData);
				setIsLoading(false);
				auth.login();
			} catch (err) {
				setIsLoading(false);
				setError(err.message || 'Something went wrong, please try again.');
			}
		}
	};

	const switchModeHandler = () => {
		// sets the formData to bring it up-to-date with the available inputs
		// this runs before we switch the mode, if we're not in log in mode
		// we are in signup mode but since the switch mode handler executes and we're
		// in that handler, it means we're now switching to login mode

		// this runs before we switch the mode
		// therefore => this is login mode
		if (!isLoginMode) {
			// in login mode, we need to drop the name field
			setFormData(
				{
					// spread the inputs to make email and pw available
					...formState.inputs,
					// drop the name field
					name: undefined,
				},
				// validity of the form depends on the email and password validity
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					// retain the current inputs
					...formState.inputs,
					// create a new name input and set the value to an empty string and isValid to false
					name: {
						value: '',
						isValid: false,
					},
					// validity of the form is false
				},
				false
			);
		}

		// switch the mode
		setIsLoginMode((prevMode) => !prevMode);
	};

	const errorHandler = () => {
		setError(null);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={errorHandler} />
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay />}
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
					<Button type='submit' disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
