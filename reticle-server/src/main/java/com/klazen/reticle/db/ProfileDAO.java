package com.klazen.reticle.db;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

public class ProfileDAO {
    @Inject EntityManager em;
	
    public Profile createProfile(Profile p) {
		em.getTransaction().begin();
		em.persist(p);
		em.getTransaction().commit();
		return p;
    }
    
	public Profile getProfile(int id) {
		return em.find(Profile.class,id);
	}
	
	public Profile getProfileByUsername(String username) {
		return em.createQuery("SELECT p FROM Profile p WHERE username = :username", Profile.class)
	        .setParameter("username",username)
	        .getSingleResult();
	}
	
	public Dashboard getDashboard(int id) {
		return em.find(Dashboard.class,id);
	}
	
	public Project getProject(int id) {
		return em.find(Project.class, id);
	}
	
	public void persist(Dashboard d) {
		em.getTransaction().begin();
		em.persist(d);
		em.getTransaction().commit();
	}
	
	public void delete(Dashboard d) {
		em.remove(d);
	}
	
	public void update(Dashboard d) {
		em.merge(d);
	}

	@Entity
	@Table(name = "PROFILE")
	public static class Profile {
	    @Id
	    @Column(name = "ID")
		public int id;
	    @Column(name = "USERNAME")
		public String username;

	    @OneToMany(cascade = CascadeType.ALL)
		public List<Dashboard> dashboards;
	}

	@Entity
	@Table(name = "DASHBOARD")
	public static class Dashboard {
	    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
		public Integer id;
	    
	    @Column(name="PROFILE_ID")
	    public Integer profile;
	    
	    @OneToMany(mappedBy="dashboard")
	    //@JoinColumn(name = "DASHBOARD_ID")
		public List<Project> projects;
	}

	@Entity
	@Table(name = "PROJECT")
	public static class Project {
	    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
		public Integer id;
	    
	    @Column(name = "NAME")
	    public String name;
	    @Column(name = "BRANCH")
	    public String branch;
	    @Column(name = "RELEASE")
	    public String release;
	    @Column(name = "PROJECT")
	    public String project;
	    @Column(name = "GC")
	    public String gc;
	    @Column(name = "FOLDER")
	    public String folder;

	    @ManyToOne
	    @JoinColumn(name="DASHBOARD_ID", nullable=false)
	    public Dashboard dashboard;
	    
	    @OneToMany(cascade = CascadeType.ALL)
	    @JoinColumn(name = "PROJECT_ID")
	    public List<Phase> phases;
	}

	@Entity
	@Table(name = "PHASE")
	public static class Phase {
	    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
		public Integer id;
	    @Column(name = "NAME")
		public String name;

	    @Column(name="PROJECT_ID")
	    public Integer projectId;
	    
	    @Embedded 
		public DateRange range;
	}
	
	@Embeddable
	public static class DateRange {
		@Column(name = "START_DATE")
		public String minDate;
		@Column(name = "END_DATE")
		public String maxDate;
	}
}
