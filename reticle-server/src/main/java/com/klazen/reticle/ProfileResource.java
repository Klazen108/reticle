package com.klazen.reticle;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.klazen.reticle.coreproviders.Public;
import com.klazen.reticle.db.ProfileDAO;
import com.klazen.reticle.db.ProfileDAO.Dashboard;
import com.klazen.reticle.db.ProfileDAO.Profile;

/**
 * Testing resource to check if the server is up. Hit it at /rest/ping
 * 
 * @author Chuck
 */
@Path("profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Public
public class ProfileResource {
	@Inject ProfileDAO profileDb;
    
	@GET @Path("/{pId}")
    public Profile getProfile(@PathParam("pId") Integer profileId) {
    	Profile p = profileDb.getProfile(profileId);
    	if (p == null) throw new NotFoundException();
    	else return p;
    }

	@POST @Path("/")
	public Dashboard saveProfile(Dashboard d) {
		profileDb.persist(d);
		return d;
	}

	@POST @Path("/login")
	public Profile login(LoginRequest req) {
		Profile p = profileDb.getProfileByUsername(req.username);
		if (p == null) throw new NotAuthorizedException("body");
		return p;
	}

	@POST @Path("/register")
	public Profile register(LoginRequest req) {
		Profile p = new Profile();
		p.username = req.username;
		profileDb.createProfile(p);
		return p;
	}
	
	public static class LoginRequest {
		public String username;
		public String password;
	}
}
