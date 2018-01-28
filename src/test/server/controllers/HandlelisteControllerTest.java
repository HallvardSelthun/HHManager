package server.controllers;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import server.database.ConnectionPool;
import server.restklasser.Handleliste;
import server.restklasser.Vare;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import static org.junit.Assert.*;

public class HandlelisteControllerTest {

    //Burde ha en @Before som sjekker om du har nødvendig data i databasen, legger det inn
    //så du senere kan teste get-metoder.

    @Test
    public void gjemHandleliste() throws Exception {
        assertTrue(HandlelisteController.gjemHandleliste(3));
    }

    @Test
    public void getHandlelister() throws Exception {
        ArrayList<Handleliste> handlelister = HandlelisteController.getHandlelister(1,1);

        assertNotNull("Noe gikk galt. getHandlelister skal ikke returnere null.",handlelister);
        for (Handleliste object: handlelister) {
            System.out.println(object.getTittel()); //Fjern denne etter hvert
        }
    }

    @Test
    public void getVarer() throws Exception {

        try (Connection connection = ConnectionPool.getConnection()){
            ArrayList<Vare> varer = HandlelisteController.getVarer(1,connection);

            assertNotNull("Noe gikk galt. getVarer skal ikke returnere null",varer);
            System.out.println("Varer i handlelisteId 1");
            for (Vare object: varer) {
                System.out.println(object.getVarenavn()); //Fjern etter hvert
            }
        }
    }

    @Test
    public void lagHandleliste() {

        Handleliste testHandleliste = new Handleliste();
        testHandleliste.setHusholdningId(2);
        testHandleliste.setTittel("Handleliste laget av test-metode");
        testHandleliste.setFrist(new java.sql.Date(Calendar.getInstance().getTime().getTime()));
        testHandleliste.setOffentlig(true);
        testHandleliste.setSkaperId(2);
        testHandleliste.setGjemt(0);

        int nyHandlelisteId = HandlelisteController.lagHandleliste(testHandleliste);
        assertTrue("nyHandleListeId skal være stærre enn -1 ", nyHandlelisteId > -1);
    }

    @Test
    public void leggInnVare() {
        Vare testVare = new Vare();
        testVare.setVarenavn("Testvare fra testklassen");
        testVare.setHandlelisteId(1);

        int resultat = HandlelisteController.leggInnVare(testVare);
        System.out.println(resultat);
        assertNotEquals(-1, resultat);
    }

    @Test
    public void getHandleliste() {
        Handleliste liste = HandlelisteController.getHandleliste(1);
        assertEquals(1, liste.getHandlelisteId());
    }

}