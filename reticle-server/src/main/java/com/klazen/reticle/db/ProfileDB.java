package com.klazen.reticle.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import javax.inject.Inject;

@Deprecated
public class ProfileDB {
	@Inject Connection conn;
	
	public Profile getProfile(int profileId) throws SQLException {
		try (PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM PROFILE WHERE ID = ?")) {
			ps.setInt(1, profileId);
			Profile p = DBUtil.getSingle(ps, r -> {
				return new Profile();
			});
			p.dashboards = getDashboards(p.id);
			return p;
		}
	}
	
	public List<Integer> getDashboards(int profileId) throws SQLException {
		try (PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM PROFILE_DASHBOARD WHERE PROFILE_ID = ?")) {
			ps.setInt(1, profileId);
			return DBUtil.getList(ps, r -> r.getInt("DASHBOARD_ID"));
		}
	}
	
	public List<Project> getProjects(int dashboardIndex) throws SQLException {
		try (PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM PROJECT WHERE DASHBOARD_ID = ?")) {
			ps.setInt(1, dashboardIndex);
			List<Project> projects = DBUtil.getList(ps, r -> {
				return new Project();
			});
			
			for (Project p : projects) {
				p.phases = getPhases(p.id);
			}
			
			return projects;
		}
	}
	
	public List<Phase> getPhases(int projectIndex) throws SQLException {
		try (PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM PHASE WHERE PROJECT_ID = ?")) {
			ps.setInt(1, projectIndex);
			List<Phase> phases = DBUtil.getList(ps, r -> {
				Phase p = new Phase();
				p.id = r.getInt("ID");
				p.projectId = projectIndex;
				p.name = r.getString("NAME");
				p.range = new DateRange(
					r.getString("START_DATE"),
					r.getString("END_DATE")
				);
				return p;
			});
			return phases;
		}
	}
	
	public static class Profile {
		public int id;
		public String username;
		public List<Integer> dashboards;
	}
	
	public static class Project {
		public Integer id;
		public Integer dashboardId;
	    public String name;
	    public String branch;
	    public String release;
	    public String project;
	    public String gc;
	    public String folder;
	    
	    public List<Phase> phases;
	}
	
	public static class Phase {
		public Integer id;
		public Integer projectId;
		public String name;
		public DateRange range;
	}
	
	public static class DateRange {
		public String minDate;
		public String maxDate;
		
		public DateRange(String minDate, String maxDate) {
			this.minDate = minDate;
			this.maxDate = maxDate;
		}
	}
}
