package server.restklasser;

import org.junit.Test;

import java.sql.Date;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class NyhetsinnleggTest {
    private Nyhetsinnlegg ni;

    public void setUp() throws Exception {
        ni = new Nyhetsinnlegg();
    }
    @Test
    public void getOgSetNyhetsinnleggId() throws Exception {
        ni.setNyhetsinnleggId(1);
        assertEquals(1,ni.getNyhetsinnleggId());
    }

    @Test
    public void getOgSetForfatterId() throws Exception {
        ni.setForfatterId(1);
        assertEquals(1, ni.getForfatterId());
    }

    @Test
    public void getOgSetTekst() throws Exception {
        ni.setTekst("tekst");
        assertEquals("tekst", ni.getTekst());
    }

    @Test
    public void getOgSetDato() throws Exception {
        ni.setDato(new Date(112,05,04));
        assertEquals("2012-06-04", ni.getDato().toString());

    }


    @Test
    public void setOgGetHusholdningId() throws Exception {
        ni.setHusholdningId(3);
        assertEquals(3,ni.getHusholdningsId());
    }
}