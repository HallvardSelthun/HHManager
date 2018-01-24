package server.controllers;

import server.database.ConnectionPool;
import server.restklasser.*;

import java.sql.*;
import java.util.ArrayList;

/**
 * Created by Nora on 19.01.2018.
 */
public class GjoremalController {
    private static final String TABELLNAVN = "gjøremål";
    private static PreparedStatement ps;
    private static Statement s;

    /**
     * Henter alle gjøremål som er felles for en spesifik husholdning
     * @param husholdningsId int id som skiller husholdninger fra hverandre
     * @return ArrayList med gjøremål
     */

    public static ArrayList<Gjoremal> hentFellesGjoremal(int husholdningsId) {
        ArrayList<Gjoremal> gjoremal = new ArrayList<>();
        String getQuery = "SELECT beskrivelse, frist, gjøremålId FROM gjøremål WHERE husholdningId = " + husholdningsId + " AND utførerId IS NULL AND fullført = 0 ORDER BY frist ";

        try (Connection connection = ConnectionPool.getConnection()) {
            PreparedStatement getStatement = connection.prepareStatement(getQuery);
            ResultSet rs = getStatement.executeQuery();

            while (rs.next()) {
                Gjoremal gjoremalet = new Gjoremal();
                gjoremalet.setGjoremalId(rs.getInt("gjøremålId"));
                gjoremalet.setBeskrivelse(rs.getString("beskrivelse"));
                gjoremalet.setFrist(rs.getDate("frist"));
                gjoremal.add(gjoremalet);
            }
            return gjoremal;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Lager et nytt gjøremåls-objekt
     * @param gjoremal
     * @return true dersom alt gikk bra, false dersom noe gikk galt.
     */
    public static int ny(Gjoremal gjoremal) {
        String beskrivelse = gjoremal.getBeskrivelse();
        int utforerId = gjoremal.getHhBrukerId();
        int husholdningId = gjoremal.getHusholdningId();
        Date frist = gjoremal.getFrist();
        int gjoremalId = -1;
        if (utforerId == 0) {
            String insertGjoremal = "insert into " + TABELLNAVN + " (beskrivelse, husholdningId, frist, fullført) values (?,?,?,0)"; /*"insert into gjoremal (beskrivelse, utførerId, husholdningId, frist, fullført) values (?,?,?,?,0)";*/
            try (Connection connection = ConnectionPool.getConnection()) {
                PreparedStatement prepInsertGjoremal = connection.prepareStatement(insertGjoremal);
                prepInsertGjoremal.setString(1, beskrivelse);
                prepInsertGjoremal.setInt(2, husholdningId);
                prepInsertGjoremal.setDate(3, frist);
                prepInsertGjoremal.executeUpdate();
                return gjoremalId;
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return gjoremalId;
        } else {
            String insertGjoremal = "insert into " + TABELLNAVN + " (beskrivelse, utførerId, husholdningId, frist, fullført) values (?,?,?,?,0)"; /*"insert into gjoremal (beskrivelse, utførerId, husholdningId, frist, fullført) values (?,?,?,?,0)";*/
            String getId = "SELECT LAST_INSERT_ID()";

            try (Connection connection = ConnectionPool.getConnection()) {
                PreparedStatement prepInsertGjoremal = connection.prepareStatement(insertGjoremal);
                prepInsertGjoremal.setString(1, beskrivelse);
                prepInsertGjoremal.setInt(2, utforerId);
                prepInsertGjoremal.setInt(3, husholdningId);
                prepInsertGjoremal.setDate(4, frist);
                prepInsertGjoremal.executeUpdate();
                prepInsertGjoremal = connection.prepareStatement(getId);
                ResultSet rs = prepInsertGjoremal.executeQuery();
                rs.next();
                gjoremalId = rs.getInt(1);
                return gjoremalId;
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return gjoremalId;
        }
    }

    public static boolean fullfortFelles(Gjoremal gjoremal) {
        int gjoremalId = gjoremal.getGjoremalId();

        String fullforGjoremal = "UPDATE " + TABELLNAVN + " SET fullført = 1 WHERE gjøremålId = " +
                gjoremalId;

        try (Connection connection = ConnectionPool.getConnection()) {
            PreparedStatement prepfullforGjoremal = connection.prepareStatement(fullforGjoremal);
            prepfullforGjoremal.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }


    public static boolean fullfort(Gjoremal gjoremal) {
        int utforerId = gjoremal.getHhBrukerId();
        int gjoremalId = gjoremal.getGjoremalId();

        String fullforGjoremal = "UPDATE " + TABELLNAVN + " SET fullført = 1 WHERE gjøremålId = " +
                gjoremalId + " AND utførerId = " + utforerId;

        try (Connection connection = ConnectionPool.getConnection()) {
            PreparedStatement prepfullforGjoremal = connection.prepareStatement(fullforGjoremal);
            prepfullforGjoremal.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static int hentVarselGjøremål(int brukerId) {
        int id = brukerId;
        int result = 0;
        String query = "SELECT COUNT(gjøremålId) antall FROM gjøremål WHERE fullført = 0 AND frist < DATE_ADD(NOW(), INTERVAL -1 DAY) AND utførerId = ? GROUP BY utførerId;";

        try (Connection con = ConnectionPool.getConnection()) {
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            rs.next();
            result = rs.getInt("antall");
            return result;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }
}

