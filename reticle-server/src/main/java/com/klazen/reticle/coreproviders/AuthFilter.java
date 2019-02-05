package com.klazen.reticle.coreproviders;

import java.io.IOException;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.klazen.reticle.JWTManager;
import com.klazen.reticle.User;

/**
 * Filter to ensure there is an authenticated token present in the 
 * {@link HttpHeader#AUTHORIZATION} header. If not, a {@link NotAuthorizedException}
 * will be thrown and the request aborted.
 * 
 * @author Chuck
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {
	@Context public HttpServletRequest req;
	
	@Inject JWTManager jwtManager;
	@Inject public User user;
	
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		//Skip if this is a public method
		if (Boolean.TRUE.equals(req.getAttribute("METHOD_IS_PUBLIC"))) return;
		
		String token = (String)req.getHeader(HttpHeaders.AUTHORIZATION);
		try {
		    DecodedJWT jwt = jwtManager.verify(token);
		    user.loadFromJWT(jwt);
		} catch (JWTVerificationException exception){
		    throw new NotAuthorizedException(HttpHeaders.AUTHORIZATION);
		}
	}
}
