package server;

import org.junit.Test;
import server.Mail;
import server.restklasser.Bruker;

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
        //Mail.sendAllerede(eposter, "Vårt hus");
    }

    @Test
    public void sendUreg() throws Exception {
        ArrayList<Bruker> brukerArrayList = new ArrayList<>();
        Bruker bruker1 = new Bruker();
        Bruker bruker2 = new Bruker();
        bruker1.setEpost("trulsmatias@gmail.com");
        bruker2.setEpost("trulsmatias@icloud.com");
        bruker1.setPassord("passord123");
        bruker2.setPassord("passord123");
        brukerArrayList.add(bruker1);
        brukerArrayList.add(bruker2);
        Mail.sendUreg(brukerArrayList, "tha Crib");
    }



    /*@Test
    public void sendGlemtPassord() throws Exception {
        Mail.sendGlemtPassord("kimia.abtahi@gmail.com", 6);
    }*/
}