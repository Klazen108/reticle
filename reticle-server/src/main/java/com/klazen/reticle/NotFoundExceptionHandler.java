package com.klazen.reticle;

import java.util.List;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class NotFoundExceptionHandler implements ExceptionMapper<NotFoundException> {

    @Context
    private HttpHeaders headers;

    public Response toResponse(NotFoundException ex) {
        return Response.status(404).entity("{\"message\":\"entity not found\"}").type(getAcceptType()).build();
    }

    private String getAcceptType() {
        return MediaType.APPLICATION_JSON;
        /*
         * List<MediaType> accepts = headers.getAcceptableMediaTypes(); if
         * (accepts!=null && accepts.size() > 0) { //choose one }else { //return a
         * default one like Application/json }
         */
    }
}