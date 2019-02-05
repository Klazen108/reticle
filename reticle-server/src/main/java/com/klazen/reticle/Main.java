package com.klazen.reticle;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.servlet.ServletContainer;

public class Main {
    private static final Logger LOGGER = Logger.getLogger(Main.class.getName());

	public static void main(String[] args) {
        Server server = configureServer();
    	startServer(server);
    	waitForEnter();
    	stopServer(server);
    }

	/**
	 * Sets up server configuration for the app
	 * 
	 * @return The configured server
	 */
	public static Server configureServer() {
		Server server = new Server(8080);

        ServletContextHandler ctx = 
                new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
                
        ctx.setContextPath("/");
        server.setHandler(ctx);

        ServletHolder serHol = ctx.addServlet(ServletContainer.class, "/rest/*");
        serHol.setInitOrder(1);
        serHol.setInitParameter("jersey.config.server.provider.packages", 
                "com.klazen.reticle");
		return server;
	}

	/**
	 * Starts the server on a separate thread.
	 * 
	 * @param server The server to start
	 */
	public static void startServer(Server server) {
		new Thread(() -> {
    		try {
                server.start();
                server.join();
	        } catch (Exception ex) {
	            LOGGER.log(Level.SEVERE, null, ex);
	        } finally {
	        	try {
	    			server.stop();
	    		} catch (Exception ex) {
	                LOGGER.log(Level.SEVERE, null, ex);
	    		} finally {
		            server.destroy();
	    		}
	        }
    	}).start();
	}

	/**
	 * Requests a server halt.
	 * 
	 * @param server The server to halt.
	 */
	public static void stopServer(Server server) {
		LOGGER.log(Level.INFO, "Halting Server...");
    	try {
			server.stop();
		} catch (Exception ex) {
            LOGGER.log(Level.SEVERE, null, ex);
		}
	}

	/**
	 * Prompts the user to press enter to halt, and waits for that.
	 */
	public static void waitForEnter() {
		LOGGER.log(Level.INFO, "Server Started! Press the enter key to halt.");
    	try {
    		new BufferedReader(new InputStreamReader(System.in)).readLine();
		} catch (IOException ex) {
            LOGGER.log(Level.SEVERE, null, ex);
		}
	}
}
