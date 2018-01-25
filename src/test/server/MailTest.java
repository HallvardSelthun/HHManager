package server;

import org.junit.Test;
import server.Mail;

import java.util.ArrayList;


public class MailTest {
    /**
     * Metoden bruker metoden sendAllerede i Mail-klassen, så den tester også sendUreg.
     * @throws Exception
     */
    @Test
    public void sendAllerede() throws Exception {
        ArrayList<String> eposter = new ArrayList<>();
        eposter.add("kimia.abtahi@gmail.com");
        //eposter.add("trulsmatias@gmail.com");
        //Mail.sendAllerede(eposter, "Vår hus");
    }

    /*@Test
    public void sendGlemtPassord() throws Exception {
        Mail.sendGlemtPassord("kimia.abtahi@gmail.com", 6);
    }*/
}