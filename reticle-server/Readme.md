# Reticle Server

This is the Java server backend for the **Reticle** Project Tracking Application.

This project is based on an embedded **Jetty** server, using **Jersey** integration for RESTful services and **WELD** for CDI. The project was written with **Java 1.8** in mind, but should be compatible with later versions.

# How To Run

From the project root, execute `mvn jetty:run`. This will download the dependencies, build the project, and boot the server.

The server will start, and you can stop it by pressing *Ctrl+C* twice.

The server root defaults to `localhost:8080/api/*` - all requests will be served relative to that. To change the configuration, see `src/main/webapp/WEB-INF/web.xml`

Try a request to [localhost:8080/api/ping](localhost:8080/api/ping) to see if the server is up!

# How To Debug

If you're using Eclipse and want to debug, ensure you have a debug confiugration set up for the jetty target:

* Debug As > Maven Build...
* Goals: jetty:run
* Source > Source Lookup Path: Java Project > reticle-server (link the source properly)
* Debug to start!

In the future, you can do *Debug As > Maven Build* (without the ellipses) to invoke your configuration, without setting it up again.

# About

The beans.xml file is included to enable CDI. 

The jetty-env.xml file is included to integrate CDI with Jetty. 

The web.xml file is included to configure the jetty server, register the servlets, and register the providers.

This project was based on [Stilkov's Minimal web app server on Github](https://github.com/stilkov/jetty-weld-jersey-sample)!