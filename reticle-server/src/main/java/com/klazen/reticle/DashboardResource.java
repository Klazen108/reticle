package com.klazen.reticle;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.klazen.reticle.coreproviders.Public;
import com.klazen.reticle.db.ProfileDAO;
import com.klazen.reticle.db.ProfileDAO.Dashboard;

/**
 * Testing resource to check if the server is up. Hit it at /rest/ping
 * 
 * @author Chuck
 */
@Path("dashboard")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DashboardResource {
	@Inject ProfileDAO profileDb;
    
	@Path("/{dbId}")
    @Public
    @GET
    public Dashboard getDashboard(@PathParam("dbId") Integer dbId) {
    	Dashboard p = profileDb.getDashboard(dbId);
    	if (p == null) throw new NotFoundException();
    	else return p;
    }

	@Path("/")
    @Public
    @POST
	public Dashboard saveDashboard(Dashboard d) {
		profileDb.persist(d);
		return d;
	}
}
