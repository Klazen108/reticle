package com.klazen.reticle.db;

import java.sql.Connection;
import java.sql.SQLException;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Default;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.dbcp2.BasicDataSource;

@ApplicationScoped
public class ConnectionManager {

    private BasicDataSource ds = new BasicDataSource();
    
    public void init() {
        ds.setUrl("jdbc:h2:~/test");
        ds.setUsername("sa");
        ds.setPassword("sa");
        ds.setMinIdle(5);
        ds.setMaxIdle(50);
        ds.setMaxOpenPreparedStatements(100);
    }
	
	@Produces @RequestScoped @Default
	public Connection getConnection() throws SQLException {
		return ds.getConnection();
	}
	
	public void closeConnection(@Disposes Connection conn) throws SQLException {
		conn.close();
	}

    @Produces
    @PersistenceContext
    public EntityManager getEM() {
    	return em;
    }
    
    public void setEM(EntityManager em) {
    	this.em = em;
    }
    
    private EntityManager em;
}
