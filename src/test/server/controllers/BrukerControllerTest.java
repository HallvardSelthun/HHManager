package server.controllers;

import org.junit.*;
import server.restklasser.Bruker;

import static org.junit.Assert.*;

public class BrukerControllerTest {
    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void getBrukernavn() throws Exception {
        Assert.assertEquals("Brage", BrukerController.getNavn(1));
    }

    @Test
    public void getEpost() throws Exception {
        assertEquals("bragehs@hotmail.com", BrukerController.getEpost(1));
    }

    @Test
    public void getFavoritthusholdning() throws Exception {
        assertEquals("1", BrukerController.getFavoritthusholdning(1));
    }

    @Test
    public void loginOk() throws Exception {
        Bruker bruker = new Bruker();
        bruker.setEpost("trulsmt@stud.ntnu.no");
        bruker.setPassord("1234");
        assertEquals(bruker, BrukerController.loginOk(bruker));
    }
}