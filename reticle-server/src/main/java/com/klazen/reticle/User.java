package com.klazen.reticle;

import com.auth0.jwt.interfaces.DecodedJWT;

/**
 * CDI Bean containing information about the current user in the request
 * context.
 * 
 * @author Chuck
 */
public class User {
	private String username = null;
	
	/**
	 * @return The username of the user currently in context.
	 */
	public String getUsername() {
		return username;
	}
	
	/**
	 * Loads user data from the specified JWT.
	 * 
	 * @param jwt The token to load user data from
	 */
	public void loadFromJWT(DecodedJWT jwt) {
		username = jwt.getSubject();
	}
	
	/**
	 * Defines if the user is authenticated, or represents a "guest user".
	 * This can be assumed to be true if used in a resource not marked
	 * with a {@link Public} binding.
	 * 
	 * @return True if the user in context is authenticated.
	 */
	public boolean isAuthenticated() {
		return username != null;
	}
}
