package com.klazen.reticle.db;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

public class DBUtil {
	public interface UnsafeFunction<I,O,E extends Throwable> {
		O apply(I val) throws E;
	}
	
	public static <T> List<T> getList(
		PreparedStatement ps, 
		UnsafeFunction<ResultSet,T,SQLException> functor
	) throws SQLException {
		ResultSet rs = ps.executeQuery();
		List<T> results = new LinkedList<T>();
		while (rs.next()) {
			results.add(functor.apply(rs));
		}
		return results;
	}
	
	public static <T> T getSingle(
		PreparedStatement ps, 
		UnsafeFunction<ResultSet,T,SQLException> functor
	) throws SQLException {
		ResultSet rs = ps.executeQuery();
		if (rs.next()) {
			return functor.apply(rs);
		}
		return null;
	}
	
	public static <T> UnsafeFunction<ResultSet,T,SQLException> forClass(
		Class<T> clazz
	) {
		return rs -> null;
	}
}
