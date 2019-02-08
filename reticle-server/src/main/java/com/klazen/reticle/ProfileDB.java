package com.klazen.reticle;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

public class ProfileDB {
	@Inject @RequestScoped Connection conn;
	
	public Profile getProfile() {
		return null;
	}
	
	public List<Project> getProjects(int dashboardIndex) throws SQLException {
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM PROJECTS WHERE DASHBOARD = ?");
		ps.setInt(1, dashboardIndex);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			//TODO
		}
		return Collections.emptyList();
	}
	
	public static class Profile {
		public String username;
	}
	
	public static class Project {
	    public String name;
	    public String branch;
	    public String release;
	    public String project;
	    public String gc;
	    public String folder;
	    
	    public List<Phase> phases;
	}
	
	public static class Phase {
		public String name;
		public DateRange range;
	}
	
	public static class DateRange {
		public String minDate;
		public String maxDate;
	}
}
