package server;

import server.restklasser.*;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import server.controllers.*;
import server.database.ConnectionPool;



import java.sql.DriverManager;


@RunWith(Suite.class)
@SuiteClasses({
        BrukerControllerTest.class,
        GenereltControllerTest.class,
        HandlelisteControllerTest.class,
        HusholdningControllerTest.class,
        UtleggControllerTest.class,
        BrukerTest.class,
        GjøremålTest.class,
        HandlelisteTest.class,
        HHMedlemTest.class,
        HusholdningTest.class,
        NyhetsinnleggTest.class,
        OppgjørTest.class,
        VareTest.class,
        MailTest.class
})

/**
 * Test manager
 */
public class TMGR {


    @BeforeClass
    public static void setup() throws Exception {
        ConnectionPool.h2();
        // creater databasen
        //Connection connection = ConnectionPool.getConnection();
        DriverManager.getConnection("jdbc:h2:mem:test;INIT=RUNSCRIPT FROM 'classpath:SQL/create.sql'\\;RUNSCRIPT FROM 'classpath:SQL/setup.sql';DB_CLOSE_DELAY=-1;");
        // setter inn testdata
    }

    @AfterClass
    public static void tearDown() throws Exception {
        ConnectionPool.closeAllConnections();
    }
}
