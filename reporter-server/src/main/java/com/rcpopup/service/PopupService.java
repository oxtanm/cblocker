package com.rcpopup.service;

import com.rcpopup.BrowserCache;
import com.rcpopup.model.KnownDomain;
import com.rcpopup.model.PopupSource;
import com.rcpopup.model.Word;
import com.rcpopup.model.WordType;
import com.rcpopup.repository.KnownDomainsRepository;
import com.rcpopup.repository.WordRepository;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;


@Service
public class PopupService {

    @Autowired
    WordRepository wordRepository;

    @Autowired
    KnownDomainsRepository knownDomainsRepository;

    @Autowired
    BrowserCache browserCache;

    int MIN_LENGHT = 8;

    private KnownDomain webPageStaticHeurustic(String domain,ChromeDriver driver) {
        List<String> accWords = new LinkedList<>();
        Set<String> filterWords = new HashSet<>();
        String exW[] = extractWords(accWords,filterWords);
        String popupXpath = exW[0];
        String acc1 = exW[1];
        String acc2 = exW[2];
        for(int i=0;i<5;i++) {
            WebElement popup = getPopup(driver, popupXpath);
            while (popup != null) {
                WebElement clickTarget = findClickTarget(driver, popup, accWords, filterWords, acc1, acc2);
                if (clickTarget == null) {
                    WebElement pparent = popup.findElement(By.xpath("./.."));
                    if (!"body".equals(pparent.getTagName())) {
                        popup = pparent;
                        continue;
                    } else {
                        break;
                    }
                } else if (!"button".equals(clickTarget.getTagName())) {
                    WebElement cparent = clickTarget.findElement(By.xpath("./.."));
                    if ("button".equals(cparent.getTagName())) {
                        clickTarget = cparent;
                    }
                }
                KnownDomain ret = new KnownDomain();
                ret.setDomain(domain);
                ret.setSsource(PopupSource.STATICHEURISTIC);

                String js = browserCache.getUniquecssjs();
                String csspath = (String) driver.executeScript(js,clickTarget);
                ret.setCsspath(csspath);
                clickTarget.click();
                //knownDomainsRepository.save(ret);
                return ret;
                //TODO? add delayed click
            }
            try {
                Thread.sleep(500);
            } catch (Exception e) {
                break;
            }
        }
        return null;
    }

    private KnownDomain exactclick(String domain) {
        List<KnownDomain> kv = knownDomainsRepository.findByDomain(domain);
        if(kv.size() > 0) {
            return kv.get(0);
        } else {
            return null;
        }
    }


    public KnownDomain removePopup(String url) {
        URI uri = null;
        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            return null;
        }
        String domain = uri.getHost();

        ChromeDriver driver = browserCache.getChromeDriver();
        KnownDomain d = exactclick(domain);
        if(d == null) {
            driver.get("https://" + domain);
            d = webPageStaticHeurustic(domain, driver);
        }
        return d;
    }

    private WebElement findClickTarget(ChromeDriver driver, WebElement popup, List<String> accWords, Set<String> filterWords, String acc1, String acc2) {
        List<WebElement> clickCandidates = new LinkedList<>();
        clickCandidates.addAll(popup.findElements(By.xpath(acc1)));
        clickCandidates.addAll(popup.findElements(By.xpath(acc2)));
        clickCandidates.addAll(popup.findElements(By.tagName("button")));
        for(WebElement candidate: clickCandidates) {
            if(evaluateClickCandidate(candidate,accWords,filterWords)) {
                return candidate;
            }
        }
        WebElement parent = popup.findElement(By.xpath("./.."));
        if(!"body".equals(parent.getTagName())) {
            return findClickTarget(driver, parent, accWords, filterWords, acc1, acc2);
        } else {
            return null;
        }
    }

    private boolean evaluateClickCandidate(WebElement candidate, List<String> accWords, Set<String> filterWords) {
        try {
            if (!candidate.isDisplayed()) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        String txt = null;
        String id = candidate.getAttribute("id");
        if("input".equals(candidate.getTagName())) {
            txt = candidate.getAttribute("value");
        } else if("button".equals(candidate.getTagName())) {
            txt = candidate.getAttribute("textContent");
        } else {
            txt = candidate.getText();
        }
        String emoij_regex = "/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g";
        txt.replaceAll(emoij_regex,"");
        if (txt.length() > 2 && txt.substring(0, 2) == "I ") {
            txt = txt.substring(2, txt.length());
        }
        txt = txt.toLowerCase();
        for (String s: filterWords) {
            if(s.length() > 1) {
                txt = txt.replaceAll(s + " ", " ");
                txt = txt.replaceAll(" " + s, " ");
            } else {
                txt = txt.replaceAll(s, " ");
            }
        }

        txt = txt.replaceAll(" ", "");
        if(txt.equals("")) {
            return false;
        }

        for (String s: accWords) {
            txt = txt.replaceAll(s, "");
        }

        if(txt.equals("")) {
            return true;
        }

        return false;
    }


    boolean isElementInViewport(WebElement el, ChromeDriver driver) {
        if(!el.isDisplayed()) {
            return false;
        }
        Rectangle rect = el.getRect();
        Dimension Windowdimension = driver.manage().window().getSize();
        if (rect.getY() > -1 && rect.getY()+rect.getHeight() <= Windowdimension.getHeight()) {
            return true;
        } else {
            return false;
        }
    }

    private WebElement getPopup(ChromeDriver driver, String popupXpath) {
        WebElement popup = null;
        List<WebElement> popupCandidates = driver.findElements(By.xpath(popupXpath));
        for(WebElement e: popupCandidates) {
            if("script".equals(e.getTagName()) || "style".equals(e.getTagName()) || !isElementInViewport(e,driver)) {
                continue;
            }
            String txt = null;
            if ("b".equals(e.getTagName()) || "strong".equals(e.getTagName()) || "a".equals(e.getTagName())) {
                WebElement parent = e.findElement(By.xpath("./.."));
                txt = parent.getText();
            } else {
                txt = e.getText();
            }

            if(txt.split(" ").length > MIN_LENGHT) {
                popup = e;
                break;
            }
        }
        return popup;
    }

    private String[] extractWords(List<String> accWords,Set<String> filterWords) {
        Iterable<Word> ws = wordRepository.findAll();
        String popupXpath = "";
        String popupXpathSpan="";
        String accText = "";
        String accInput = "";
        String accSpan = "";
        for(Word w : ws) {
            if(w.getStype() == WordType.POPUP) {
                if(popupXpath != "") {
                    popupXpath = popupXpath + " or ";
                    popupXpathSpan = popupXpathSpan + " or ";
                }
                popupXpath = popupXpath + "contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + w.getWord() + "')";
                popupXpathSpan = popupXpathSpan + "contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + w.getWord() + "')";

            } else if(w.getStype() == WordType.ACC || w.getStype() == WordType.ACCPRESENS) {
                accWords.add(w.getWord());
                if(!accText.equals("")) {
                    accText = accText+ " or ";
                    accInput = accInput+ " or ";
                    accSpan = accSpan+ " or ";
                }
                accText = accText + "contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + w.getWord() + "')";
                accInput = accInput + "contains(translate(@value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + w.getWord() + "')";
                accSpan = accSpan + "contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + w.getWord() + "')";
            } else if(w.getStype() == WordType.ACCFILTER) {
                filterWords.add(w.getWord());
            }
        }
        popupXpath = "//*[" + popupXpath + "]|//span[" + popupXpathSpan + "]";
        String acc1 = ".//*[" + accText + "]|//input[" + accInput + "]";
        String acc2 = ".//span[" + accSpan + "]";
        String ret[] = { popupXpath,acc1,acc2};
        accWords.sort(new java.util.Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                // TODO: Argument validation (nullity, length)
                return s2.length() - s1.length();// comparision
            }
        });
        return ret;
    }
}
