package com.klazen.reticle.db;

import javax.inject.Inject;
import javax.persistence.EntityManager;

public class AbstractDAO<E> {
    @Inject public EntityManager em;
    
    private final Class<E> clazz;
    
    public AbstractDAO(Class<E> clazz) {
    	this.clazz = clazz;
    }
	
    public E create(E p) {
		em.getTransaction().begin();
		em.persist(p);
		em.getTransaction().commit();
		return p;
    }
    
	public E get(int id) {
		return em.find(clazz,id);
	}
	
	public void persist(E d) {
		em.getTransaction().begin();
		em.persist(d);
		em.getTransaction().commit();
	}
	
	public void delete(E d) {
		em.remove(d);
	}
	
	public void update(E d) {
		em.merge(d);
	}
}
