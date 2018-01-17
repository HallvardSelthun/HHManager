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
public class GjøremålTest {
    Gjøremål gjøremål;
    @Before
    public void setUp() throws Exception {
        gjøremål = new Gjøremål();

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetGjøremålId() throws Exception {
        gjøremål.setGjøremålId(1);
        assertEquals(1,gjøremål.getGjøremålId());
    }

    @Test
    public void setOgGetHusholdningId() throws Exception {
        gjøremål.setHusholdningId(3);
        assertEquals(3, gjøremål.getHusholdningId());
    }

    @Test
    public void setOgGetHhBrukerId() throws Exception {
        gjøremål.setHhBrukerId(1);
        assertEquals(1,gjøremål.getHhBrukerId());
    }

    @Test
    public void setOgGetFullført() throws Exception {
        gjøremål.setFullført(true);
        assertEquals(true, gjøremål.getFullført());
    }

    @Test
    public void isFullført() throws Exception {
        gjøremål.setFullført(true);
        assertTrue(gjøremål.isFullført());
    }

    @Test
    public void setOgGetFrist() throws Exception {
        gjøremål.setFrist(new Date(112, 05, 04));
        assertEquals("2012-06-04",gjøremål.getFrist().toString());
    }

    @Test
    public void setOgGetBeskrivelse() throws Exception {
        gjøremål.setBeskrivelse("beskrivelse");
        assertEquals("beskrivelse", gjøremål.getBeskrivelse());
    }

}