/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { withRouter } from 'react-router-dom';
import { signUp, closeAuthError, signUpError } from './actions';
import defaultStyles from './SignUp.module.scss';
import StyledInput from '../common/StyledInput/StyledInput';
import StyledButton from '../common/StyledButton/StyledButton';
import ErrorModal from '../common/modal/ErrorModal';

const SignUp = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [displayName, setDisplayName] = useState('');

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: noop
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (password === passwordTwo) {
            props.signUp(email, password, displayName);
        } else {
            props.signUpError({
                code: 'auth/mismatching passwords',
                message: 'The passwords do not match'
            });
        }
    };

    return (
        <div className={props.styles.signUpWrapper}>
            <div className={props.styles.shadowWrapper}>
                <form
                    className={props.styles.signUpForm}
                    action="#!"
                    onSubmit={handleSubmit}
                >
                    <div className={props.styles.signUpMessage}>
                    Sign up
                    </div>

                    <StyledInput label="Email" icon="envelope" onChange={e => setEmail(e)} value={email} />
                    <StyledInput label="Password" type="password" icon="lock" onChange={setPassword} value={password} />
                    <StyledInput label="Password" type="password" icon="lock" onChange={setPasswordTwo} value={passwordTwo} />
                    <StyledInput label="Display Name" onChange={e => setDisplayName(e)} value={displayName} />

                    <div className={props.styles.submitButtons}>
                        <StyledButton
                            color="primary"
                            onClick={handleSubmit}
                            text="Sign up"
                            type="submit"
                        />
                    </div>
                </form>
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
            <ErrorModal
                closeModal={props.closeAuthError}
                headerMessage="Sign Up Error"
                isOpen={props.signUpErrorMessage.length > 0}
                errorCode={props.signUpErrorCode}
                errorMessage={props.signUpErrorMessage}
            />
        </div>
    );
};

const mapDispatchToProps = {
    closeAuthError,
    signUp,
    signUpError
};

const mapStateToProps = state => ({
    signUpErrorMessage: state.auth.signUpError,
    signUpErrorCode: state.auth.signUpErrorCode
});

SignUp.defaultProps = {
    signUpErrorCode: '',
    signUpErrorMessage: '',
    styles: defaultStyles
};

SignUp.propTypes = {
    closeAuthError: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    signUp: PropTypes.func.isRequired,
    signUpError: PropTypes.func.isRequired,
    signUpErrorCode: PropTypes.string,
    signUpErrorMessage: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
