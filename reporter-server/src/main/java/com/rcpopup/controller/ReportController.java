package com.rcpopup.controller;

import com.rcpopup.model.Report;
import com.rcpopup.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report")
public class ReportController {
	@Autowired
	ReportService reportService;
	
	@GetMapping("")
    public List<Report> list() {
        return reportService.listAllReport();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Report> get(@PathVariable Long id) {
        try {
            Report report = reportService.getReport(id);
            return new ResponseEntity<Report>(report, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<Report>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PostMapping("")
    public void add(@RequestBody Report report) {
        reportService.saveReport(report);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody Report report, @PathVariable Long id) {
        try {
            Report existReport = reportService.getReport(id);
            report.setId(id);
            reportService.saveReport(report);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reportService.deleteReport(id);
    }
    
    @GetMapping("/unresolved")
    public ResponseEntity<?> getUnresolved(@RequestParam String extension_id, @RequestParam Integer status) {
        try {
            long countUnresolved = reportService.countUnresolved(extension_id, status);
            return new ResponseEntity<Long>(countUnresolved, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/fixed")
    public ResponseEntity<?> getFixed(@RequestParam String extension_id, @RequestParam Integer status) {
        try {
            long countUnresolved = reportService.countFixed(extension_id,status);
            return new ResponseEntity<Long>(countUnresolved, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    int SvToV(String sv) {
	    String[] svv = sv.split(".");
	    if(svv.length < 2) {
            return Integer.valueOf(sv);
        } else {
	        return Integer.valueOf(svv[0])*1000 + Integer.valueOf(svv[1]);
        }
    }

    @GetMapping("/v2/fixed")
    public ResponseEntity<?> getFixed2(@RequestParam String version) {
        try {
            long count = 0;
            int v = SvToV(version);
            List<Report> rv = reportService.getFixed();
            for(Report r: rv) {
                if(v < SvToV(r.getFixedversion())) {
                    count++;
                }
            }
            return new ResponseEntity<Long>(count, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/upgrade")
    public ResponseEntity<?> upgrade(@RequestParam String extension_id, @RequestParam String version) {
        try {
            long r = reportService.upgrade(extension_id,version);
            return new ResponseEntity<Long>(r, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
