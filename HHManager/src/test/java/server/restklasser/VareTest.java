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
    public void getOgSetDatoKjøpt() throws Exception {
        vare.setDatoKjøpt(new Date(112, 05,04));
        assertEquals("2012-06-04",vare.getDatoKjøpt().toString());
    }


    @Test
    public void getOgSetHandlelisteId() throws Exception {
        vare.setHandlelisteId(1);
        assertEquals(1,vare.getHandlelisteId());
    }


    @Test
    public void getOgSetKjøperId() throws Exception {
        vare.setKjøperId(1);
        assertEquals(1, vare.getKjøperId());
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
    public void isOgSetKjøpt() throws Exception {
        vare.setKjøpt(false);
        assertFalse(vare.isKjøpt());
    }

}