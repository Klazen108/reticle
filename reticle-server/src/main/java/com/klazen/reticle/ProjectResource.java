package com.klazen.reticle;

import java.sql.SQLException;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.klazen.reticle.ProfileDB.Project;
import com.klazen.reticle.coreproviders.Public;

/**
 * Testing resource to check if the server is up. Hit it at /rest/ping
 * 
 * @author Chuck
 */
@Path("project")
public class ProjectResource {
	@Inject ProfileDB profileDb;
    
	@Path("/{dbId}")
    @Public
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public List<Project> getProjects(@PathParam("dbId") Integer dbId) throws SQLException {
    	return profileDb.getProjects(dbId);
    }
}
