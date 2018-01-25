package server.restklasser;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Date;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class VareTest {
    private Vare vare;
    @Before
    public void setUp() throws Exception {
        vare = new Vare();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void getOgSetDatoKjopt() throws Exception {
        vare.setDatoKjopt(new Date(112, 05,04));
        assertEquals("2012-06-04",vare.getDatoKjopt().toString());
    }


    @Test
    public void getOgSetHandlelisteId() throws Exception {
        vare.setHandlelisteId(1);
        assertEquals(1,vare.getHandlelisteId());
    }


    @Test
    public void getOgSetKjoperId() throws Exception {
        vare.setKjoperId(1);
        assertEquals(1, vare.getKjoperId());
    }

    @Test
    public void getOgSetVareId() throws Exception {
        vare.setVareId(1);
        assertEquals(1, vare.getVareId());
    }

    @Test
    public void getOgSetVarenavn() throws Exception {
        vare.setVarenavn("Varenavn");
        assertEquals("Varenavn", vare.getVarenavn());
    }


    @Test
    public void isOgSetKjopt() throws Exception {
        vare.setKjopt(false);
        assertFalse(vare.isKjopt());
    }

}