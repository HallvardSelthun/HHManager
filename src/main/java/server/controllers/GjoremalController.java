package server.controllers;

import server.database.ConnectionPool;
import server.restklasser.*;

import java.sql.*;

/**
 * Created by Nora on 19.01.2018.
 */
public class GjoremalController {
    private static final String TABELLNAVN = "gjøremål";
    private static PreparedStatement ps;
    private static Statement s;


    public static boolean ny(Gjøremål gjøremål) {
        String beskrivelse = gjøremål.getBeskrivelse();
        int utførerId = gjøremål.getHhBrukerId();
        int husholdningId = gjøremål.getHusholdningId();
        Date frist = gjøremål.getFrist();

        String insertGjoremal = "insert into gjøremål (beskrivelse, utførerId, husholdningId, frist, fullført) values (?,?,?,?,0)";

        try (Connection connection = ConnectionPool.getConnection()) {

            PreparedStatement prepInsertGjoremal = connection.prepareStatement(insertGjoremal);
            prepInsertGjoremal.setString(1, beskrivelse);
            prepInsertGjoremal.setInt(2, utførerId);
            prepInsertGjoremal.setInt(3, husholdningId);
            prepInsertGjoremal.setDate(4, frist);
            prepInsertGjoremal.executeUpdate();
            return true;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return  false;
    }
}

