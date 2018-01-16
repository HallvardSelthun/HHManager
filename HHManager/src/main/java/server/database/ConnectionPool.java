package server.database;

import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public final class ConnectionPool {

    //Magisk black box som gjør alt for oss
    private static final BasicDataSource dataSource = new BasicDataSource();

    //Attributter for tilkobling til databsen
    static {
        dataSource.setDriverClassName("com.mysql.jdbc.Driver"); //Set the specific driver "class name"
        dataSource.setUrl("jdbc:mysql://mysql.stud.iie.ntnu.no:3306/g_tdat2003_t6");
        dataSource.setUsername("g_tdat2003_t6");
        dataSource.setPassword("uz4rZOca");
    }

    private ConnectionPool() {
        dataSource.setTimeBetweenEvictionRunsMillis(10000); //10 minutter mellom hver gang den sjekker for idle connections
        dataSource.setMaxTotal(20);
    }

    //Lager en connection mot databasen hvis en connection ikke finnes. Finnes en connection tar den
    //en fra connection poolen.
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void closeAllConnections() throws SQLException{
        dataSource.close();
    }

    public static BasicDataSource getDataSource() {
        return dataSource;
    }

}