import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../store/AuthContext';


const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.includes('@') }
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.includes('@') }
    }

    return { value: '', isValid: false }
}

const passReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.trim().length > 6 }
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.trim().length > 6 }
    }

    return { value: '', isValid: false }
}
const Login = (props) => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
    const [passState, dispatchPass] = useReducer(passReducer, { value: '', isValid: null })

    const authCtx = useContext(AuthContext);

    const { isValid:emailIsValid } = emailState;
    const { isValid:passwordIsValid } = passState;
    useEffect(() => {
        const identfier = setTimeout(() => {
            console.log('Checking form validity!');
            setFormIsValid(
                emailState.isValid && passState.isValid
            );
        }, 500);

        return () => {
            console.log("clean up");
            clearTimeout(identfier);
        }
    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event) => {
        // setEnteredEmail(event.target.value);
        dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

        setFormIsValid(
            // event.target.value.includes('@') && enteredPassword.trim().length > 6
            emailState.isValid && passState.isValid
        );
    };

    const passwordChangeHandler = (event) => {
        // setEnteredPassword(event.target.value);
        dispatchPass({ type: 'USER_INPUT', val: event.target.value });

        setFormIsValid(
            //   emailState.value.includes('@') && event.target.value.trim().length > 6
            passState.isValid && event.target.value.trim().length > 6
        );
    };

    const validateEmailHandler = () => {
        // setEmailIsValid(emailState.value.includes('@'));
        // setEmailIsValid(emailState.isValid)
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const validatePasswordHandler = () => {
        // setPasswordIsValid(enteredPassword.trim().length > 6);
        dispatchPass({ type: 'INPUT_BLUR' });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        authCtx.onLogin(emailState.value, passState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''
                        }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${passState.isValid === false ? classes.invalid : ''
                        }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn} disabled={!formIsValid}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
