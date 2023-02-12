package com.rcpopup.model;

import java.util.stream.Stream;

public enum WordType {
    ACC(1),
    ACCPRESENS(2),
    POPUP(3),
    ACCFILTER(4);

    public int wordtype;

    private WordType(int wordtype) {
        this.wordtype = wordtype;
    }

    public int getWordtype() {
        return wordtype;
    }

    public static WordType of(int wordtype) {
        return Stream.of(WordType.values())
                .filter(p -> p.getWordtype() == wordtype)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
