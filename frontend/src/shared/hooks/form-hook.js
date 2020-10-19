import { useCallback, useReducer } from 'react';

// The reducer takes the initial state and action -> much like Redux
const formReducer = (state, action) => {
    // it switches on action type
  switch (action.type) {
      // only one case provided on this reducer
      case 'INPUT_CHANGE':
        // formIsValid is a helper variable that we use to check the validity of the overall form
        let formIsValid = true;
        // loop through the inputs object in the state
        for (const inputId in state.inputs) {
          // if check to see if the input we're looking at is the input being updated in the current action
          if (inputId === action.inputId) {
            // if it is, form is Valid is equal to the validity of isValid and the current formIsValid value
            formIsValid = formIsValid && action.isValid;
          // looking at an input in the form state which is not currently getting updated through the currently running action
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid },
          },
          isValid: formIsValid,
        };
        case 'SET_DATA':
          return {
            inputs: action.inputs,
            isValid: action.formIsValid
          }
      default:
        return state;
    }
  };

// the useForm hook is a custom hook to help us deal with creation and updating of places
// takes initialInputs and initialFormValidity as parameters, dynamic to accept values from both create and update form actions
export const useForm = (initialInputs, initialFormValidity) => {
    // use the useReducer hook to perform complex state handling in the function above (formReducer)
    // takes the formReducer as an argument
    const [formState, dispatch] = useReducer(formReducer, {
      // takes the inital state as the second argument which come from the components where the useForm hook is used
      // inputs is an object
      inputs: initialInputs,
      // isValid is a boolean value
      isValid: initialFormValidity,
  });

  // the inputHandler uses the useCallback hook to avoid infinite renders
  // takes the input id, value and isValid 
  const inputHandler = useCallback((id, value, isValid) => {
    // disptaches an action type and value, isValid, inputId
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    });
    // takes an array of dependencies to re-render the function
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  // returns the formState and inputHandler to access the useForm hook from the components where it's imported
  return [formState, inputHandler, setFormData];
}