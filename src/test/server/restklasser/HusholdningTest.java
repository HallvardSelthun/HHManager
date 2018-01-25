package server.restklasser;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class HusholdningTest {
    Husholdning husholdning;
    @Before
    public void setUp() throws Exception {
        husholdning = new Husholdning();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetHandlelister() throws Exception {
        ArrayList<Handleliste> handlelistes = new ArrayList<>();
        husholdning.setHandlelister(handlelistes);
        assertEquals(handlelistes, husholdning.getHandlelister());
    }

    @Test
    public void setOgGetGjoremal() throws Exception {
        ArrayList<Gjoremal> gjoremals = new ArrayList<>();
        husholdning.setGjoremal(gjoremals);
        assertEquals(gjoremals, husholdning.getGjoremal());
    }

    @Test
    public void setOgGetNyhetsinnlegg() throws Exception {
        ArrayList<Nyhetsinnlegg> nyhetsinnleggs = new ArrayList<>();
        husholdning.setNyhetsinnlegg(nyhetsinnleggs);
        assertEquals(nyhetsinnleggs, husholdning.getNyhetsinnlegg());
    }

    @Test
    public void setOgGetMedlemmer() throws Exception {
        ArrayList<Bruker> brukers = new ArrayList<>();
        husholdning.setMedlemmer(brukers);
        assertEquals(brukers, husholdning.getMedlemmer());
    }

    @Test
    public void addHandleliste() throws Exception {
        Handleliste handleliste = new Handleliste();
        husholdning.addHandleliste(handleliste);
        assertEquals(handleliste, husholdning.getHandlelister().get(0));
    }

    @Test
    public void addMedlem() throws Exception {
        Bruker bruker = new Bruker();
        husholdning.addMedlem(bruker);
        assertEquals(bruker, husholdning.getMedlemmer().get(0));
    }

    @Test
    public void addNyhetsinnlegg() throws Exception {
        Nyhetsinnlegg nyhetsinnlegg = new Nyhetsinnlegg();
        husholdning.addNyhetsinnlegg(nyhetsinnlegg);
        assertEquals(nyhetsinnlegg, husholdning.getNyhetsinnlegg().get(0));
    }

    @Test
    public void addGjormal() throws Exception {
        Gjoremal gjoremal = new Gjoremal();
        husholdning.addGjormal(gjoremal);
        assertEquals(gjoremal, husholdning.getGjoremal().get(0));
    }

    @Test
    public void setOgGetHusholdningId() throws Exception {
        husholdning.setHusholdningId(2);
        assertEquals(2, husholdning.getHusholdningId());
    }

    @Test
    public void setOgGetNavn() throws Exception {
        husholdning.setNavn("navn");
        assertEquals("navn", husholdning.getNavn());
    }

}