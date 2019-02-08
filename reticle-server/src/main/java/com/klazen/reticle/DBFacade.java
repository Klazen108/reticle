package com.klazen.reticle;

import java.sql.Connection;
import java.sql.SQLException;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Default;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;

import org.h2.jdbcx.JdbcDataSource;

@ApplicationScoped
public class DBFacade {
	@Produces @RequestScoped @Default
	public Connection getConnection() throws SQLException {
		//TODO: configure from context listener
		JdbcDataSource ds = new JdbcDataSource();
		ds.setURL("jdbc:h2:˜/test");
		ds.setUser("sa");
		ds.setPassword("sa");
		Connection conn = ds.getConnection();
		return conn;
	}
	
	public void closeConnection(@Disposes Connection conn) throws SQLException {
		conn.close();
	}
}
