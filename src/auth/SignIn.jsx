/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { withRouter } from 'react-router-dom';
import defaultStyles from './SignIn.module.scss';
import { signIn } from './actions';
import StyledButton from '../common/StyledButton/StyledButton';
import * as constants from '../constants';
import TextInput from '../common/TextInput/TextInput';
import * as textInputConstants from '../common/TextInput/constants';

const SignIn = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: noop
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        props.signIn(email, password);
    };

    const redirectToPasswordReset = useCallback(() => {
        props.history.push(constants.URL.RESET_PASSWORD);
    }, [props.history]);

    return (
        <div className={props.styles.signInWrapper}>
            <div className={props.styles.shadowWrapper}>
                <form
                    className={props.styles.signInForm}
                    action="#!"
                    onSubmit={handleSubmit}
                >
                    <div className={props.styles.signInMessage}>
                        Sign In
                    </div>
                    <div className={props.styles.textInputsWrapper}>
                        <TextInput
                            label="Email"
                            icon={textInputConstants.textInputIcons.email}
                            onChange={e => setEmail(e)}
                            value={email}
                            iconColor="secondary"
                        />
                        <TextInput
                            label="Password"
                            icon={textInputConstants.textInputIcons.lock}
                            onChange={e => setPassword(e)}
                            value={password}
                            iconColor="secondary"
                            type="password"
                        />
                    </div>

                    <div className={props.styles.submitButtons}>
                        <StyledButton
                            color="primary"
                            onClick={handleSubmit}
                            text="Sign in"
                            type="submit"
                        />
                    </div>
                    <div className={props.styles.passwordWrapper}>
                        <div
                            className={props.styles.forgotPasswordLink}
                            role="button"
                            tabIndex={0}
                            onClick={redirectToPasswordReset}
                        >
                            Forgot your password?
                        </div>
                    </div>
                </form>
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
        </div>
    );
};

SignIn.defaultProps = {
    styles: defaultStyles
};

SignIn.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    signIn: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    signIn
};

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
