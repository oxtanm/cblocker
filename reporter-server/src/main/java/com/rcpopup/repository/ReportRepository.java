package com.rcpopup.repository;

import com.rcpopup.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
	
	@Query(value = "SELECT COUNT(s) FROM Report s WHERE s.extension_id=:extension_id AND s.status=:status")
	public long countExtStatus(String extension_id, Integer status);

	@Query(value = "SELECT COUNT(s) FROM Report s WHERE s.extension_id=:extension_id AND s.status=:status and s.fixedversion is not null")
	public long countFixed(String extension_id, Integer status);

	@Query(value= "select s from Report s WHERE s.status=0 and s.fixedversion is not null group by s.url")
	public List<Report> getFixed();

	@Query(value = "SELECT s FROM Report s WHERE s.extension_id=:extension_id AND s.status=0 and s.fixedversion is not null")
	public List<Report> getFixed(String extension_id);

}
