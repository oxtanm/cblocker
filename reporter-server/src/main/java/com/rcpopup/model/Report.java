package com.rcpopup.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "report",
		indexes = {
				@Index(
						name="IX_url_extension_id",
						columnList = "url, extension_id",
						unique = true
				)
		})
public class Report {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String url;
	private String extension_id;
	private int status;
	private String reportversion;
	private String fixedversion;
	private LocalDateTime creationdate;

	@PostLoad
	void fillTransient() {
		if(creationdate == null) {
			creationdate = LocalDateTime.now();
		}
	}

	@PrePersist
	void fillPersistent() {
		if(creationdate == null) {
			creationdate = LocalDateTime.now();
		}
	}
}
