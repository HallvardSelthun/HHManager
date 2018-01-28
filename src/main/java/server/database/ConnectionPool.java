package server.database;

import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public final class ConnectionPool {

    //Variabler for setup av systemet
    //Endre det som er mellom gåseøyenene
    final static String SQLDriver = "com.mysql.cj.jdbc.Driver";
    final static String databaseURL = "jdbc:mysql://mysql.stud.iie.ntnu.no:3306/g_tdat2003_t6?useSSL=false";
    final static String username = "g_tdat2003_t6";
    final static String password = "uz4rZOca";

    private static final BasicDataSource dataSource = new BasicDataSource();

    //Attributter for tilkobling til databsen
    static {
        dataSource.setDriverClassName(SQLDriver); //Set the specific driver "class name"
        dataSource.setUrl(databaseURL);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
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

    /**
     * For testing. Kobler connectionPoolen til h2-databasen
     */
    public static void h2() {
        dataSource.setDriverClassName("org.h2.Driver");
        dataSource.setUrl("jdbc:h2:mem:test");
        dataSource.setUsername("");
        dataSource.setPassword("");
    }


}