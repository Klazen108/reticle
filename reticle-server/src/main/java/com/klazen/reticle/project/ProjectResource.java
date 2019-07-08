package com.klazen.reticle.project;

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

@Path("project")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Public
public class ProjectResource {
	@Inject ProjectDAO db;
	
	@GET @Path("/{pId}")
    public Project getProfile(@PathParam("pId") Integer id) {
    	Project p = db.get(id);
    	if (p == null) throw new NotFoundException();
    	else return p;
    }

	@POST @Path("/")
	public Project saveProfile(Project d) {
		db.persist(d);
		return d;
	}
}
