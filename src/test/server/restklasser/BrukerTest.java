package server.restklasser;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * Created by Hallvard on 17.01.2018.
 */
public class BrukerTest {
    private Bruker bruker;
    @Before
    public void setUp() throws Exception {
        bruker = new Bruker();

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void setOgGetNavn() throws Exception {
        bruker.setNavn("Per");
        assertEquals("Per", bruker.getNavn());
    }

    @Test
    public void addOgGetGjøremål() throws Exception {
        Gjøremål gjøremål = new Gjøremål();
        bruker.addGjøremål(gjøremål);
        assertEquals(gjøremål, bruker.getGjøremål().get(0));
    }

    @Test
    public void setOgGetBrukerId() throws Exception {
        bruker.setBrukerId(1);
        assertEquals(1,bruker.getBrukerId());
    }

    @Test
    public void setOgGetPassord() throws Exception {
        bruker.setHashen("hash");
        assertEquals("hash",bruker.getHashen());
    }

    @Test
    public void setOgGetBalanse() throws Exception {
        bruker.setBalanse(30);
        assertEquals(30, bruker.getBalanse(), 0.01);
    }

    @Test
    public void setOgGetEpost() throws Exception {
        bruker.setEpost("epost@hotmail.com");
        assertEquals("epost@hotmail.com", bruker.getEpost());
    }

    @Test
    public void setOgGetFavHusholdning() throws Exception {
        bruker.setFavHusholdning(3);
        assertEquals(3, bruker.getFavHusholdning());
    }

}