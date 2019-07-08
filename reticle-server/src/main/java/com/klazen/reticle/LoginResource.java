package com.klazen.reticle;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.klazen.reticle.core.JWTManager;
import com.klazen.reticle.core.User;
import com.klazen.reticle.coreproviders.Public;

/**
 * Testing resource to check if the server is up. Hit it at /rest/ping
 * 
 * @author Chuck
 */
@Path("login")
public class LoginResource {
	@Inject JWTManager jwtManager;
    @Inject User user;
    
    /**
     * Authenticates against the server, receiving a token if authentication is
     * successful.
     * 
     * @param req The login request containing the username and password
     * @return The authorization token
     */
    @Public
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public LoginResponse login(LoginRequest req) {
    	//TODO: verify the user
	    return new LoginResponse(jwtManager.getToken(req.username));
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public LoginResponse refresh() {
	    return new LoginResponse(jwtManager.getToken(user.getUsername()));
    }
    
    /**
     * Request entity definition for the login method.
     * @author Chuck
     */
    public static class LoginRequest {
    	/** The username of the user logging in */
    	public String username;
    	/** The password of the user logging in */
    	public String password;
    }
    
    /**
     * Response entity definition for the login method.
     * @author Chuck
     */
    public static class LoginResponse {
    	/**
    	 * This is the bearer token to use on future requests to identify the client.
    	 * Set the Authorization header using this:
    	 * <pre>Authorization: Bearer [token]</pre>
    	 */
    	public String token;

		public LoginResponse(String token) {
			this.token = token;
		}
    }
}
