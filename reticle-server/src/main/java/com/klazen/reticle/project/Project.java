package com.klazen.reticle.project;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.klazen.reticle.db.ProfileDAO.Dashboard;
import com.klazen.reticle.db.ProfileDAO.Phase;

@Entity
@Table(name = "PROJECT")
public class Project {
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