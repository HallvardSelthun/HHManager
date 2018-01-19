package server.controllers;

import org.junit.Test;
import server.restklasser.Bruker;
import server.restklasser.Husholdning;

import java.util.ArrayList;

import static org.junit.Assert.*;

public class HusholdningControllerTest {
    @Test
    public void getNavn() throws Exception {
        assertEquals("Scrumgruppa", HusholdningController.getNavn(1));
    }
/*
    @Test
    public void getAlleHusholdninger() {
        assertEquals(null, HusholdningController.getAlleHusholdninger());
    }

    */
 /**
     * Denne tester en autoincremnt-verdi. Greit å bruke underveis, men skal ikke brukes ellers
     */
    /*@Test
    public void ny() throws Exception {
        Husholdning husholdning = new Husholdning();
        husholdning.setNavn("ueurururwedcd");
        Bruker bruker1 = new Bruker();
        Bruker bruker2 = new Bruker();
        bruker1.setEpost("ryryryr@mail.com");
        bruker2.setEpost("ppppp@mail.com");
        ArrayList<Bruker> medlemmer = new ArrayList<>();
        medlemmer.add(bruker1);
        medlemmer.add(bruker2);
        husholdning.setMedlemmer(medlemmer);
        assertEquals(34, HusholdningController.ny(husholdning));
    }*/
/*
    @Test
    public void slettSisteTegn() throws Exception {
        StringBuilder stringBuilder = new StringBuilder("tester tester");
        HusholdningController.slettSisteTegn(stringBuilder, 2);
        assertEquals("tester test", stringBuilder.toString());
    }*/
}