package com.klazen.reticle.coreproviders;

import java.io.IOException;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

/**
 * Request filter to establish the request context as "public" - that is, not requiring
 * an authenticated token.
 * 
 * @author Chuck
 */
@Public
@Provider
@Priority(Priorities.AUTHENTICATION-1)
public class PublicFilter implements ContainerRequestFilter {
	@Context
	public HttpServletRequest req;
	
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		req.setAttribute("METHOD_IS_PUBLIC", true);
	}
}
