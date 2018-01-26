package server.controllers;

import org.junit.*;
import server.restklasser.*;

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
     * Denne tester en autoincremnt-verdi. Dette går greit når det testes opp mot h2
     */
    @Test
    public void ny() throws Exception {
        Husholdning husholdning = new Husholdning();
        husholdning.setNavn("bvbvbyryryetetet");
        Bruker bruker1 = new Bruker();
        Bruker bruker2 = new Bruker();
        bruker1.setEpost("ingrid.stuland.evensen@gmail.com");
        bruker2.setEpost("trulsmt@stud.ntnu.no");
        ArrayList<Bruker> medlemmer = new ArrayList<>();
        medlemmer.add(bruker1);
        medlemmer.add(bruker2);
        husholdning.setMedlemmer(medlemmer);
        assertEquals(3, HusholdningController.ny(husholdning));
        assertEquals(4, HusholdningController.ny(husholdning));
    }
/*
    @Test
    public void slettSisteTegn() throws Exception {
        StringBuilder stringBuilder = new StringBuilder("tester tester");
        HusholdningController.slettSisteTegn(stringBuilder, 2);
        assertEquals("tester test", stringBuilder.toString());
    }*/
}