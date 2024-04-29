import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
// import jwt from 'jsonwebtoken';
import { CLIENT_ID } from '../../constants';
export default function GoogleSignIn({ clientId, onSignIn }) {
    const onSuccess = (response) => {
        // thisis jwt
        console.log('response obj', response.credential);

        // console.log(`JWT `, jwt.verify(response.credential,CLIENT_ID ));
        onSignIn(response.credential);
        // call authorization API on the backend
        
    }

    const onError = (error) => {
        console.error(`Login failure`, error)
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                {...{
                    onSuccess,
                    onError,
                }}
            />
        </GoogleOAuthProvider>
    )
}
