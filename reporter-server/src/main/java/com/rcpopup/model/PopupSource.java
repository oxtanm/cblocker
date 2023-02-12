package com.rcpopup.model;

import java.util.stream.Stream;

public enum PopupSource {
    STATICHEURISTIC(1),
    MANUAL(2);

    public int popupsource;

    private PopupSource(int popupsource) {
        this.popupsource = popupsource;
    }

    public int getPopupsource() {
        return popupsource;
    }

    public static PopupSource of(int popupsource) {
        return Stream.of(PopupSource.values())
                .filter(p -> p.getPopupsource() == popupsource)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }

}
