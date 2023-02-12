package com.rcpopup.service;

import com.rcpopup.model.Report;
import com.rcpopup.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ReportService {
	@Autowired
	private ReportRepository reportRepository;
	
	public List<Report> listAllReport() {
		return reportRepository.findAll();
	}
	
	public void saveReport(Report report) {
		reportRepository.save(report);
	}
	
	public Report getReport(Long id) {
		return reportRepository.findById(id).get();
	}
	
	public void deleteReport(Long id) {
		reportRepository.deleteById(id);
	}
	
	public long countUnresolved(String extension_id, Integer status) {
		return reportRepository.countExtStatus(extension_id, status);
	}

	public long countFixed(String extension_id, Integer status) {
		return reportRepository.countFixed(extension_id,status);
	}

	public List<Report> getFixed() {
		return reportRepository.getFixed();
	}

	private int semanticToInt(String semanticv) {
		int ret = 0;
		String[] tokens = semanticv.split("\\.");
		ret = Integer.valueOf(tokens[0])*1000;
		if(tokens.length > 1) {
			ret = ret + Integer.valueOf(tokens[1]);
		}
		return ret;
	}

	public long upgrade(String extension_id, String new_version) {
		int ret = 0;
		int n_v = semanticToInt(new_version);
		List<Report> lr = reportRepository.getFixed(extension_id);
		for(Report l: lr) {
			if(l.getStatus() == 0 && l.getExtension_id().equals(extension_id) && l.getFixedversion() != null) {
				int f_v = semanticToInt(l.getFixedversion());
				if(n_v >= f_v) {
					reportRepository.deleteById(l.getId());
					ret++;
				}
			}
		}
		return ret;
	}

}
