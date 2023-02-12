package com.rcpopup.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String word;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id")
    Language language;

    @Transient
    WordType stype;

    @Basic
    int type;

    @PostLoad
    void fillTransient() {
        if (type > 0) {
            this.stype = WordType.of(type);
        }
    }

    @PrePersist
    void fillPersistent() {
        if (stype != null) {
            this.type = stype.getWordtype();
        }
    }

}
