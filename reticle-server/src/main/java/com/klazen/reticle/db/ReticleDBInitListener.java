package com.klazen.reticle.db;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.Persistence;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.h2.tools.Server;

/**
 * ContextListener which handles database init and teardown. This must be installed in
 * the servlet context, typically via the web.xml:
 * 
 *  <pre>
 *  &lt;listener&gt;  
 *     &lt;listener-class&gt;
 *         com.klazen.reticle.db.ReticleDBInitListener
 *     &lt;/listener-class&gt;
 * &lt;/listener  
 *  </pre>
 * 
 * @author Chuck
 *
 */
public class ReticleDBInitListener implements ServletContextListener {
	Server server;
	
	Logger LOGGER = Logger.getLogger(ReticleDBInitListener.class.getName());
	
	@Inject ConnectionManager connMgr;

	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		LOGGER.info("Initializing Context...");
		try {
			server = Server
				.createTcpServer("-tcpPort", "31337", "-tcpAllowOthers")
				.start();
			
			connMgr.init();
			
			LOGGER.info("Running SQL Migrations from resources/sql...");
			Connection conn = connMgr.getConnection();
			Statement stmt = conn.createStatement();
			URL sqlFolder = getClass().getClassLoader().getResource("/sql");
			for (File migration : new File(sqlFolder.getPath()).listFiles()) {
				runMigration(stmt, migration);
			}
			LOGGER.info("SQL Migrations Complete.");
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
		
		connMgr.setEM(Persistence
    	            .createEntityManagerFactory("firstOne")
    	            .createEntityManager());
	}

	/**
	 * Executes a SQL file.
	 * 
	 * @param stmt The statement to use to execute the SQL
	 * @param migrationFile The file containing the SQL to execute
	 */
	public void runMigration(Statement stmt, File migrationFile) {
		LOGGER.info("Running Migration: "+migrationFile.getName());
		try {
			String sql = readFile(migrationFile,StandardCharsets.UTF_8);
			stmt.execute(sql);
		} catch (Exception ex) {
			LOGGER.log(Level.SEVERE, ex,
				() -> "Migration Failed: "+migrationFile.getName());
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		connMgr.getEM().close();
		server.stop();
	}
	
	static String readFile(File file, Charset encoding) throws IOException {
	  byte[] encoded = Files.readAllBytes(file.toPath());
	  return new String(encoded, encoding);
	}
}
