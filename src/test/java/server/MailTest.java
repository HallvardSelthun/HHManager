package server;

import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.*;

public class MailTest {
    @Test
    public void sendAllerede() throws Exception {
        ArrayList<String> eposter = new ArrayList<>();
        eposter.add("kimia.abtahi@gmail.com");
        eposter.add("trulsmatias@gmail.com");
        eposter.add("noraor@stud.ntnu.no");
        //Mail.sendAllerede(eposter, "Huset vårt");
    }

}