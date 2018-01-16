package server.controllers;

// Vi har controller-klasser fordi da kan vi teste login-funksjonalitet uten å bruke services. JUnit og sånn.
// Her kan vi også ha SQL-kall

import server.database.ConnectionPool;
import server.restklasser.*;

import java.sql.*;

/**
 * Her ligger logikken til restklassen Bruker. Den kobler opp mot database-poolen ved hjelp av Connection pool.
 * Her blir sql-setninger behandlet.
 */
public class BrukerController {
    private static PreparedStatement ps;
    private static Statement s;
    private final static String TABELLNAVN = "bruker";

    public static String getBrukernavn(int brukerid) {
        return GenereltController.getString("navn", TABELLNAVN, brukerid);
    }

    public static String getEpost(int brukerid) {
        return GenereltController.getString("epost", TABELLNAVN, brukerid);
    }

    public static String getFavoritthusholdning(int brukerid) {
        return GenereltController.getString("favorittHusholdning", TABELLNAVN, brukerid);
    }

    public static boolean registrerBruker(Bruker bruker) {
        String pass = bruker.getPassord();
        String navn = bruker.getNavn();
        String epost = bruker.getEpost();
        String epostLedig = "SELECT epost FROM bruker WHERE epost = ?";

        String query = "INSERT INTO bruker (passord, navn, epost) VALUES (?, ?, ?)";


        try (Connection con = ConnectionPool.getConnection()) {

            ps = con.prepareStatement(epostLedig);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String res = rs.getString("epost");
                    if (res != (epost)) {
                        return false;
                    }
                }
            }
            ps = con.prepareStatement(query);
            ps.setString(1, pass);
            ps.setString(2, navn);
            ps.setString(3, epost);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Sjekker om epost og passord stemmer
     *
     * @param epost
     * @param passord
     * @return true hvis dataene stemmer
     */
    public static Bruker loginOk(String epost, String passord) {
        String query = "SELECT passord, favorittHusholdning FROM bruker WHERE epost = ?";
        Bruker bruker = new Bruker();
        int favHus = 0;
        bruker.setFavHusholdning(favHus);
        try (Connection con = ConnectionPool.getConnection()) {
            ps = con.prepareStatement(query);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                String res = rs.getString("passord");
                int favHusDB = rs.getInt("favorittHusholdning");
                if (favHus != favHusDB){
                    bruker.setFavHusholdning(favHusDB);
                }
                if (res.equals(passord)) {
                    return bruker;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Setter ny favoritthusholdning til brukeren
     *
     * @return true hvis operasjonen ble godkjent
     */
    public static void setNyFavoritthusholdning(String brukerId, String husholdningId) {
        GenereltController.update(TABELLNAVN, "husholdningId", husholdningId, brukerId);
    }

    public static Bruker getBrukerData(String epost) {

        Bruker bruker = new Bruker();
        String getBrukerId = "SELECT brukerId, navn FROM bruker WHERE epost = ?";
        int brukerId = 0;

        try (Connection con = ConnectionPool.getConnection()) {
            ps = con.prepareStatement(getBrukerId);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    bruker.setEpost(epost);
                    bruker.setNavn(rs.getString("navn"));
                    brukerId = rs.getInt("brukerId");
                    bruker.setBrukerId(brukerId);
                }
            }

            ResultSet rs;

            String hentMineGjørmål = "SELECT * FROM gjøremål WHERE utførerId = " + brukerId;
            s = con.createStatement();
            rs = s.executeQuery(hentMineGjørmål);

            while (rs.next()) {
                Gjøremål gjøremål = new Gjøremål();
                gjøremål.setBeskrivelse(rs.getString("beskrivelse"));
                int fullført = rs.getInt("fullført");
                if (fullført == 1) {
                    gjøremål.setFullført(true);
                } else {
                    gjøremål.setFullført(false);
                }
                gjøremål.setGjøremålId(rs.getInt("gjøremålId"));
                gjøremål.setHhBrukerId(brukerId);
                gjøremål.setFrist(rs.getDate("frist"));
                bruker.addGjøremål(gjøremål);
            }

            bruker.setBalanse(0);


        } catch (Exception e) {
            e.printStackTrace();
        }
        return bruker;
    }

    public static void setNyEpost(String epost, String brukerId) {
        GenereltController.update(TABELLNAVN, "epost", epost, brukerId);
    }

    public static void setNyttPassord(String brukerId, String passord) {
        GenereltController.update(TABELLNAVN, "passord", passord, brukerId);
    }

    private double getBalanse(int brukerId) {
        return 0;
    }
}
