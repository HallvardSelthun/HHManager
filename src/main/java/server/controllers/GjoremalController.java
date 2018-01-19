package server.controllers;

import java.sql.PreparedStatement;
import java.sql.Statement;

/**
 * Created by Nora on 19.01.2018.
 */
public class GjoremalController {
    private static final String TABELLNAVN = "gjøremål";
    private static PreparedStatement ps;
    private static Statement s;


    /*public static int ny(Gjøremål gjøremål) {
        String beskrivelse = gjøremål.getBeskrivelse();
        int utførerId = gjøremål.getHhBrukerId();

        String insertGjoremal = "insert into " + TABELLNAVN + " (navn) values (?)";

        try (Connection connection = ConnectionPool.getConnection()) {

            PreparedStatement prepInsertGjoremal = connection.prepareStatement(insertGjoremal, PreparedStatement.RETURN_GENERATED_KEYS);
            prepInsertGjoremal.setString(1, beskrivelse);
            prepInsertGjoremal.executeUpdate();
            ResultSet idHusRS = prepInsertGjoremal.getGeneratedKeys();
            idHusRS.next();
            husId = idHusRS.getInt(1);
            prepInsertHus.close();
        }
    }*/
}

