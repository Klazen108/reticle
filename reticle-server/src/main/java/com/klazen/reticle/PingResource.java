package com.klazen.reticle;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Testing resource to check if the server is up. Hit it at /rest/ping
 * 
 * @author Chuck
 */
@Public
@Path("ping")
public class PingResource {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getMessage() {
        return "Pong!\n";
    }
}
