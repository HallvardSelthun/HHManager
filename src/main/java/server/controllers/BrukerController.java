package server.controllers;

// Vi har controller-klasser fordi da kan vi teste login-funksjonalitet uten å bruke services. JUnit og sånn.
// Her kan vi også ha SQL-kall

import server.Mail;
import server.database.ConnectionPool;
import server.restklasser.*;
import server.util.Encryption;
import server.util.RandomGenerator;

import java.sql.*;
import java.util.Objects;

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
        String[] encrypted = Encryption.instance.passEncoding(bruker.getPassord());
        String navn = bruker.getNavn();
        String epost = bruker.getEpost();
        String epostLedig = "SELECT epost FROM bruker WHERE epost = ?";

        String query = "INSERT INTO bruker (hash, navn, epost, salt) VALUES (?, ?, ?, ?)";


        try (Connection con = ConnectionPool.getConnection()){

            ps = con.prepareStatement(epostLedig);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String res = rs.getString("epost");
                    if (!Objects.equals(res, epost)) {
                        return false;
                    }
                }
            }
            ps = con.prepareStatement(query);
            ps.setString(1, encrypted[0]);
            ps.setString(2, navn);
            ps.setString(3, epost);
            ps.setString(4, encrypted[1]);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Sjekker om epost og passord stemmer.
     * @param bruker brukeren som sjekkes
     * @return brukerdata hvis ok: epost, navn, id, favoritthusholdning, gjøremal
     */
    public static Bruker loginOk(Bruker bruker) {
        String query = "SELECT hash, favorittHusholdning, navn, brukerId, salt FROM bruker WHERE epost = ?";
        try (Connection con = ConnectionPool.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setString(1, bruker.getEpost());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                if (!Encryption.instance.isPassOk(bruker.getPassord(), rs.getString("hash"), rs.getString("salt"))) return null;
                bruker.setNavn(rs.getString("navn"));
                bruker.setBrukerId(rs.getInt("brukerId"));
                bruker.setFavHusholdning(rs.getInt("favorittHusholdning"));
                String hentGjoremal = "SELECT * FROM gjøremål WHERE utførerId = " + bruker.getBrukerId() + " AND fullført = 0";
                PreparedStatement psGjoremal = con.prepareStatement(hentGjoremal);
                ResultSet rs2 = psGjoremal.executeQuery();
                while(rs2.next()){
                    Gjøremål gjøremal = new Gjøremål();
                    gjøremal.setFrist(rs2.getDate("frist"));
                    gjøremal.setHusholdningId(rs2.getInt("husholdningId"));
                    gjøremal.setBeskrivelse(rs2.getString("beskrivelse"));
                    gjøremal.setGjøremålId(rs2.getInt("gjøremålId"));
                    gjøremal.setHhBrukerId(bruker.getBrukerId());
                    bruker.addGjøremål(gjøremal);

                }
                psGjoremal.close();
                rs.close();
                rs2.close();
                return bruker;
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Setter ny favoritthusholdning til brukeren
     * @param brukerId til brukeren det gjelder.
     * @param husholdningId til husholdningen som skal bli favoritt
     */
    public static boolean setNyFavoritthusholdning(int brukerId, String husholdningId) {
         return GenereltController.update(TABELLNAVN, "favorittHusholdning", husholdningId, brukerId);
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
        setNyttPassord(brukerId, passord);
        return passord;
    }

    /**
     * Oppdaterer databasen med den nye hashen og saltet
     * @param brukerId til brukeren som får nytt passord
     * @param passord som skal hashes
     */
    public static void setNyttPassord(int brukerId, String passord) {
        String[] hashOgSalt = Encryption.instance.passEncoding(passord);
        String sqlSetning = "update " + TABELLNAVN + " set hash=?, salt=? where " + TABELLNAVN + "id=" + brukerId;
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlSetning)) {
            preparedStatement.setString(1, hashOgSalt[0]);
            preparedStatement.setString(2, hashOgSalt[1]);
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
