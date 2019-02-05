package com.klazen.reticle.coreproviders;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.ws.rs.NameBinding;

/**
 * Namebinding attribute to indicate method should be publicly accessible.
 * @author Chuck
 */
@Retention(RUNTIME)
@Target({TYPE,METHOD})
@NameBinding
public @interface Public {

}
