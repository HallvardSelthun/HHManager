package server.controllers;

// Vi har controller-klasser fordi da kan vi teste login-funksjonalitet uten å bruke services. JUnit og sånn.
// Her kan vi også ha SQL-kall

import server.Mail;
import server.database.ConnectionPool;
import server.restklasser.*;
import server.util.Encryption;
import server.util.RandomGenerator;

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
    public static int getFavoritthusholdning(int brukerid) {
        return GenereltController.getInt("favorittHusholdning", TABELLNAVN, "brukerId", Integer.toString(brukerid));
    }

    public static int getBrukerId(String epost) {
        return GenereltController.getInt("brukerId", TABELLNAVN, "epost", epost);
    }

    /**
     * Henter diverse brukerdata ved hjelp av epost
     * @param epost til brukeren
     * @return epost, navn, brukerId, gjøremål til brukeren uavhengig av husstand, balanse = 0
     */
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
        String pass = bruker.getHashen();
        String navn = bruker.getNavn();
        String epost = bruker.getEpost();
        String epostLedig = "SELECT epost FROM bruker WHERE epost = ?";

        String query = "INSERT INTO bruker (passord, navn, epost) VALUES (?, ?, ?)";


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
     * @return brukerdata hvis ok: epost, navn, id, favoritthusholdning, gjøremal
     */
    public static Bruker loginOk(String epost, String passord) {
        String query = "SELECT hash, favorittHusholdning, navn, brukerId, salt FROM bruker WHERE epost = ?";

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
                String hash = rs.getString("hash");
                String salt = rs.getString("salt");
                int favHusDB = rs.getInt("favorittHusholdning");
                if (favHus != favHusDB){
                    bruker.setFavHusholdning(favHusDB);
                }
                if (Encryption.instance.isPassOk(passord, hash, salt)) {
                    String hentGjoremal = "SELECT * FROM gjøremål WHERE utførerId = " + bruker.getBrukerId() + " AND fullført = 0";
                    ps = con.prepareStatement(hentGjoremal);
                    ResultSet rs2 = ps.executeQuery();
                    while(rs2.next()){
                        Gjøremål gjøremål = new Gjøremål();
                        gjøremål.setFrist(rs2.getDate("frist"));
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
    public static void setNyFavoritthusholdning(int brukerId, String husholdningId) {
         GenereltController.update(TABELLNAVN, "husholdningId", husholdningId, brukerId);
    }


    public static void setNyEpost(String epost, int brukerId) {
        GenereltController.update(TABELLNAVN, "epost", epost, brukerId);
    }

    /**
     * Lager nytt passord og lagrer det i databasen
     * @param brukerId til personen som trenger nytt passord
     * @return det nye passordet
     */
    public static String nyttTilfeldigPass(int brukerId) {
        String passord = RandomGenerator.stringulns(8);
        String[] endcoded = Encryption.instance.passEncoding(passord);
        setNyttPassord(brukerId, endcoded[0], endcoded[1]);
        return passord;
    }

    /**
     * Oppdaterer databasen med den nye hashen og saltet
     * @param brukerId til brukeren som får nytt passord
     * @param hash hashen av passordet og saltet
     * @param salt til hashen
     */
    public static void setNyttPassord(int brukerId, String hash, String salt) {
        String sqlSetning = "update " + TABELLNAVN + " set hash=?, salt=? where " + TABELLNAVN + "id=" + brukerId;
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlSetning)) {
            preparedStatement.setString(1, hash);
            preparedStatement.setString(2, salt);
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void setNyttNavn(int brukerId, String navn){
        GenereltController.update(TABELLNAVN, "navn", navn, brukerId);
    }

    private double getBalanse(int brukerId) {
        return 0;
    }
}
