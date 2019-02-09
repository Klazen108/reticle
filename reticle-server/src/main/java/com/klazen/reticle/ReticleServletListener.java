package com.klazen.reticle;

import java.sql.SQLException;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.h2.tools.Server;

public class ReticleServletListener implements ServletContextListener {
	Server server;
	
	Logger LOGGER = Logger.getLogger(ReticleServletListener.class.getName());
	
	@Inject ConnectionManager connMgr;
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		LOGGER.info("Initializing Context...");
		try {
			server = Server
				.createTcpServer("-tcpPort", "31337", "-tcpAllowOthers")
				.start();
			
			connMgr.init();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		server.stop();
	}
}
