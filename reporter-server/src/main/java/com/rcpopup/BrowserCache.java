package com.rcpopup;

import com.google.common.base.Charsets;
import com.google.common.io.ByteSource;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import java.io.IOException;
import java.io.InputStream;

@ApplicationScope
@Component
public class BrowserCache {
    public ChromeDriver getChromeDriver() {
        if(driver == null) {
            initChromeDriver();
        }
        return driver;
    }

    ChromeDriver driver=null;

    String uniquecssjs=null;

    public String getUniquecssjs() {
        if(uniquecssjs == null) {
            initUniqueCssJs();
        }
        return uniquecssjs;
    }


    private void initChromeDriver() {
        System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        ChromeOptions chromeOptions = new ChromeOptions();
        //chromeOptions.addArguments("--headless");
        chromeOptions.addArguments("--no-sandbox");
        chromeOptions.addArguments("--disable-dev-shm-usage");
        chromeOptions.setBinary("/usr/bin/chromium");
        chromeOptions.setExperimentalOption("w3c", false);
        driver= new ChromeDriver(chromeOptions);
    }

    private void initUniqueCssJs() {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("uniqueCss.js");
        ByteSource byteSource = new ByteSource() {
            @Override
            public InputStream openStream() throws IOException {
                return inputStream;
            }
        };
        try {
            uniquecssjs= byteSource.asCharSource(Charsets.UTF_8).read();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
