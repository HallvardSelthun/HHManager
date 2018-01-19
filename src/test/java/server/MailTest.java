package server;

import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.*;


public class MailTest {
    /**
     * Metoden bruker metoden sendAllerede i Mail-klassen, så den tester også sendUreg.
     * @throws Exception
     */
    @Test
    public void sendAllerede() throws Exception {
        ArrayList<String> eposter = new ArrayList<>();
        eposter.add("kimia.abtahi@gmail.com");
        eposter.add("trulsmatias@gmail.com");
        Mail.sendAllerede(eposter, "Vår hus");
    }

    @Test
    public void sendGlemtPassord() throws Exception {
        Mail.sendGlemtPassord("kimia.abtahi@gmail.com", 15);
    }

}