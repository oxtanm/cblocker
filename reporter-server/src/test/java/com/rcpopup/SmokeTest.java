package com.rcpopup;

import com.rcpopup.model.KnownDomain;
import com.rcpopup.service.PopupService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

@SpringBootTest
@Sql(scripts="/populate.sql")
class SmokeTest {
    @Autowired
    PopupService popupService;

    @Test
    public void smokeSites() throws InterruptedException {
        String sites[] = {
                "https://www.svd.se",
                "https://svt.se",
                "https://arbetsformedlingen.se/",
                "https://arkenzoo.se",
                "https://arla.se",
                "https://breakit.se",
                "https://byggmax.se",
                "https://cafe.se",
                "https://dagensps.se",
                "https://di.se",
                "https://dn.se",
                "https://fastighetstidningen.se",
                "https://feber.se",
                "https://forskning.se",
                "https://illvet.se",
                "https://jula.se",
                "https://lakartidningen.se",
                "https://mobil.se",
                "https://nvp.se",
                "https://realtid.se",
                "https://sydsvenskan.se",
                "https://facebook.com",
                "https://yepstr.com"
        };
        for(String site: sites) {
            KnownDomain d = popupService.removePopup(site);
            Assertions.assertNotNull(d, site);
        }
    }

}
