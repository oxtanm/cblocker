package com.rcpopup.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class KnownDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String domain;

    private String xpath;

    private String csspath;

    private String comment;

    @Transient
    PopupSource ssource;

    @Basic
    int source;

    @PostLoad
    void fillTransient() {
        if (source > 0) {
            this.ssource = PopupSource.of(source);
        }
    }

    @PrePersist
    void fillPersistent() {
        if (ssource != null) {
            this.source = ssource.getPopupsource();
        }
    }


}
