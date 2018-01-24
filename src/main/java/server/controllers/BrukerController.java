package server.controllers;

// Vi har controller-klasser fordi da kan vi teste login-funksjonalitet uten å bruke services. JUnit og sånn.
// Her kan vi også ha SQL-kall

import server.Mail;
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

    public static String getNavn(int brukerid) {
        return GenereltController.getString("navn", TABELLNAVN, brukerid);
    }

    /**
     * Henter epost-adressen til en bruker gitt brukerens id.
     * @param brukerid int id som identifiserer en bruker.
     * @return String epost-adressen.
     */
    public static String getEpost(int brukerid) {
        return GenereltController.getString("epost", TABELLNAVN, brukerid);
    }

    /**
     * Henter favoritthusholdning til bruker
     * @param brukerid til brukeren vi finner favoritthusholdningen til
     * @return id til favoritthusholdning
     */
    public static String getFavoritthusholdning(int brukerid) {
        return GenereltController.getString("favorittHusholdning", TABELLNAVN, brukerid);
    }
    public static int getBrukerId(String epost) {
        return GenereltController.getInt("brukerId", TABELLNAVN, "epost", epost);
    }

    public static void sendGlemtPassordMail(String epost) {
        int brukerId = getBrukerId(epost);
        Mail.sendGlemtPassord(epost, brukerId);
    }

    /**
     * Sletter et medlem fra en husholdning gitt brukerens id.
     * @param brukerid int id som identifiserer en bruker
     * @return true om brukeren ble slettet, false om noe gikk galt under sletting.
     */
    public static boolean slettFraHusholdning(int brukerid, int husholdningid) {
        String getQuery = "DELETE FROM hhmedlem WHERE brukerId = " + brukerid + " AND husholdningId =" + husholdningid;

        try (Connection con = ConnectionPool.getConnection()){
            ps = con.prepareStatement(getQuery);
            ps.executeUpdate();
            return true;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Registrerer en bruker i systemet.
     * @param bruker er et Bruker-objekt som skal registreres
     * @return true dersom bruker ble registrert, false om noe gikk galt under registrering.
     */

    public static boolean registrerBruker(Bruker bruker) {
        String pass = bruker.getPassord();
        String navn = bruker.getNavn();
        String epost = bruker.getEpost();
        String epostLedig = "SELECT epost FROM bruker WHERE epost = ?";

        String query = "INSERT INTO bruker (hash, navn, epost) VALUES (?, ?, ?)";


        try (Connection con = ConnectionPool.getConnection()){

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
     * Sjekker om epost og passord stemmer.
     * @param epost
     * @param passord
     * @return true hvis dataene stemmer
     */
    public static Bruker loginOk(String epost, String passord) {
        String query = "SELECT hash, favorittHusholdning, navn, brukerId FROM bruker WHERE epost = ?";

        Bruker bruker = new Bruker();
        int favHus = 0;
        bruker.setFavHusholdning(favHus);
        bruker.setEpost(epost);
        try (Connection con = ConnectionPool.getConnection()) {
            ps = con.prepareStatement(query);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                bruker.setNavn(rs.getString("navn"));
                bruker.setBrukerId(rs.getInt("brukerId"));
                String res = rs.getString("hash");
                int favHusDB = rs.getInt("favorittHusholdning");
                if (favHus != favHusDB){
                    bruker.setFavHusholdning(favHusDB);
                }
                if (res.equals(passord)) {
                    String hentGjoremal = "SELECT * FROM gjøremål WHERE utførerId = " + bruker.getBrukerId() + " AND fullført = 0";
                    ps = con.prepareStatement(hentGjoremal);
                    ResultSet rs2 = ps.executeQuery();
                    while(rs2.next()){
                        Gjøremål gjøremål = new Gjøremål();
                        gjøremål.setFrist(rs2.getDate("frist"));
                        gjøremål.setHusholdningId(rs2.getInt("husholdningId"));
                        gjøremål.setBeskrivelse(rs2.getString("beskrivelse"));
                        gjøremål.setGjøremålId(rs2.getInt("gjøremålId"));
                        gjøremål.setHhBrukerId(bruker.getBrukerId());
                        bruker.addGjøremål(gjøremål);
                    }
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
    public static boolean setNyFavoritthusholdning(int brukerId, String husholdningId) {
         return GenereltController.update(TABELLNAVN, "favorittHusholdning", husholdningId, brukerId);
    }

    /*public static Bruker getBrukerData(String epost) {

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
    }*/

    public static void setNyEpost(String epost, int brukerId) {
        GenereltController.update(TABELLNAVN, "epost", epost, brukerId);
    }

    public static void setNyttPassord(int brukerId, String passord) {
        GenereltController.update(TABELLNAVN, "hash", passord, brukerId);
    }

    public static void setNyttNavn(int brukerId, String navn){
        GenereltController.update(TABELLNAVN, "navn", navn, brukerId);
    }

    private double getBalanse(int brukerId) {
        return 0;
    }
}
