# Reticle Server

This is the Java server backend for the **Reticle** Project Tracking Application.

This project is based on an embedded **Jetty** server, using **Jersey** integration for RESTful services. The project was written with **Java 1.8** in mind, but should be compatible with later versions.

# How To Run

From the project root, execute `mvn exec:java`. This will download the dependencies, build the project, and run the main class.

The server will start, and you can stop it by pressing *Enter* once the server has started.

The server root defaults to `localhost:8080/api/*` - all requests will be served relative to that. To change the configuration, see `com.klazen.Main.configureServer()`

Try a request to [localhost:8080/api/ping] to see if the server is up!
