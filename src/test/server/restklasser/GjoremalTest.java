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
public class GjoremalTest {
    Gjoremal gjoremal;
    @Before
    public void setUp() throws Exception {
        gjoremal = new Gjoremal();

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetGjoremalId() throws Exception {
        gjoremal.setGjoremalId(1);
        assertEquals(1,gjoremal.getGjoremalId());
    }

    @Test
    public void setOgGetHusholdningId() throws Exception {
        gjoremal.setHusholdningId(3);
        assertEquals(3, gjoremal.getHusholdningId());
    }

    @Test
    public void setOgGetHhBrukerId() throws Exception {
        gjoremal.setHhBrukerId(1);
        assertEquals(1,gjoremal.getHhBrukerId());
    }

    @Test
    public void setOgGetFullfort() throws Exception {
        gjoremal.setFullfort(true);
        assertEquals(true, gjoremal.getFullfort());
    }

    @Test
    public void isFullfort() throws Exception {
        gjoremal.setFullfort(true);
        assertTrue(gjoremal.isFullfort());
    }

    @Test
    public void setOgGetFrist() throws Exception {
        gjoremal.setFrist(new Date(112, 05, 04));
        assertEquals("2012-06-04",gjoremal.getFrist().toString());
    }

    @Test
    public void setOgGetBeskrivelse() throws Exception {
        gjoremal.setBeskrivelse("beskrivelse");
        assertEquals("beskrivelse", gjoremal.getBeskrivelse());
    }

}