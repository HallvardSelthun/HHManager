package server.restklasser;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Date;
import java.util.ArrayList;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class HandlelisteTest {
    Handleliste handleliste;
    @Before
    public void setUp() throws Exception {
        handleliste = new Handleliste();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetVarer() throws Exception {
        ArrayList<Vare> varer = new ArrayList<>();
        handleliste.setVarer(varer);
        assertEquals(varer, handleliste.getVarer());
    }

    @Test
    public void setOgGetHusholdningId() throws Exception {
        handleliste.setHusholdningId(1);
        assertEquals(1,handleliste.getHusholdningId());
    }

    @Test
    public void setOgGetHandlelisteId() throws Exception {
        handleliste.setHandlelisteId(2);
        assertEquals(2, handleliste.getHandlelisteId());
    }

    @Test
    public void addOgGetVarer() throws Exception {
        Vare vare = new Vare();
        handleliste.addVarer(vare);
        assertEquals(vare , handleliste.getVarer().get(0));
    }

    @Test
    public void setOgGetSkaperId() throws Exception {
        handleliste.setSkaperId(1);
        assertEquals(1,handleliste.getSkaperId());
    }

    @Test
    public void setOgGetTittel() throws Exception {
        handleliste.setTittel("Tittel");
        assertEquals("Tittel", handleliste.getTittel());
    }

    @Test
    public void setOgIsOffentlig() throws Exception {
        handleliste.setOffentlig(true);
        assertTrue(handleliste.isOffentlig());
    }

    @Test
    public void setFrist() throws Exception {
        handleliste.setFrist(new Date(112, 05, 04));
        assertEquals("2012-06-04", handleliste.getFrist().toString());
    }

}