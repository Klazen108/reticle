package com.klazen.reticle.core;

import java.util.Calendar;
import java.util.Date;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

/**
 * Injectable, stateless bean to abstract JWT specifics from the app
 * @author Chuck
 *
 */
public class JWTManager {
    Algorithm algorithm = Algorithm.HMAC256("this is the server token secret, must be very secret!");

    /**
     * Constructs and signs a token for a given subject. The token will expire in
     * 60 minutes.
     * 
     * @param subject The subject to issue the token to
     * @return The JWT token
     */
    public String getToken(String subject) {
    	Calendar calExpire = Calendar.getInstance();
    	calExpire.setTime(new Date());
    	calExpire.add(Calendar.MINUTE, 60);
    	
    	String token = JWT.create()
	        .withIssuer("reticle")
	        .withExpiresAt(calExpire.getTime())
	        .withSubject(subject)
	        .sign(algorithm);
    	return token;
    }
    
    /**
     * Verifies a token is legitimate, signed, and not expired.
     * 
     * @param token The token to verify
     * @return The decoded token, if verified
     * @throws JWTVerificationException if the token is not valid
     */
    public DecodedJWT verify(String token) {
	    JWTVerifier verifier = JWT.require(algorithm)
	        .withIssuer("reticle")
	        .build(); //Reusable verifier instance
	    DecodedJWT jwt = verifier.verify(token);
	    return jwt;
    }
}
