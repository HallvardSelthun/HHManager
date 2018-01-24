package server.restklasser;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class HHMedlemTest {
    HHMedlem hhMedlem;
    @Before
    public void setUp() throws Exception {
        hhMedlem = new HHMedlem();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetHhBrukerId() throws Exception {
        hhMedlem.setHhBrukerId(2);
        assertEquals(2, hhMedlem.getHhBrukerId());
    }

    @Test
    public void setOgGetHusholdningsId() throws Exception {
        hhMedlem.setHusholdningsId(1);
        assertEquals(1, hhMedlem.getHusholdningsId());
    }

    @Test
    public void setOgGetAdmin() throws Exception {
        hhMedlem.setAdmin(false);
        assertFalse(hhMedlem.isAdmin());
    }

}