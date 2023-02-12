package com.rcpopup.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shortname;


    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "language",
            orphanRemoval = true)
    List<Word> words = new ArrayList<>();

}
