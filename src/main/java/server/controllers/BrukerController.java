package server.controllers;

// Vi har controller-klasser fordi da kan vi teste login-funksjonalitet uten å bruke services. JUnit og sånn.
// Her kan vi også ha SQL-kall

import server.Mail;
import server.database.ConnectionPool;
import server.restklasser.Bruker;
import server.restklasser.Gjoremal;
import server.util.Encryption;
import server.util.RandomGenerator;

import java.security.SecureRandom;
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
    private final static int PASSWORD_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();


    /**
     * Henter navn på bruker gitt brukerens id.
     *
     * @param brukerid int id som identifiserer en bruker.
     * @return String navnet til brukeren.
     */

    public static String getNavn(int brukerid) { return GenereltController.getString("navn", TABELLNAVN, brukerid); }

    /**
     * Henter profilbilde på bruker gitt brukerens id.
     *
     * @param brukerid int id som identifiserer en bruker.
     * @return String url til brukerens profilbilde.
     */

    public static String getProfilbilde(int brukerid) {return GenereltController.getString("profilbilde", TABELLNAVN, brukerid);}

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

    /**
     * Sender nytt tilfeldig generert passord på mail, refererer til metode i Mail-klasse
     * @param epost String epostadressen til brukeren som skal få tilsendt mail.
     * @return true dersom mailen ble sendt, false dersom noe gikk galt undder sending.
     */
    public static boolean sendGlemtPassordMail(String epost) {
        int brukerId = getBrukerId(epost);
        return Mail.sendGlemtPassord(epost, brukerId);
    }

    /**
     * Sletter et medlem fra en husholdning gitt brukerens id.
     * @param brukerid int id som identifiserer en bruker
     * @return true om brukeren ble slettet, false om noe gikk galt under sletting.
     */
    public static boolean slettFraHusholdning(int brukerid, int husholdningid) {
        String getQuery = "DELETE FROM hhmedlem WHERE brukerId = " + brukerid + " AND husholdningId =" + husholdningid;

        try (Connection con = ConnectionPool.getConnection()) {
            ps = con.prepareStatement(getQuery);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
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


        try (Connection con = ConnectionPool.getConnection()) {

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
        String query = "SELECT hash, favorittHusholdning, navn, brukerId, salt, profilbilde FROM bruker WHERE epost = ?";
        try (Connection con = ConnectionPool.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setString(1, bruker.getEpost());
            try (ResultSet rs = ps.executeQuery()) {

                if(!rs.next()) return null;
                if (!Encryption.instance.isPassOk(bruker.getPassord(), rs.getString("hash"), rs.getString("salt"))) return null;
                bruker.setNavn(rs.getString("navn"));
                bruker.setBrukerId(rs.getInt("brukerId"));
                bruker.setFavHusholdning(rs.getInt("favorittHusholdning"));
                bruker.setProfilbilde(rs.getString("profilbilde"));
                String hentGjoremal = "SELECT * FROM gjoremal WHERE utførerId = " + bruker.getBrukerId() + " AND fullført = 0";
                PreparedStatement psGjoremal = con.prepareStatement(hentGjoremal);
                ResultSet rs2 = psGjoremal.executeQuery();
                while(rs2.next()){
                    Gjoremal gjoremal = new Gjoremal();
                    gjoremal.setFrist(rs2.getDate("frist"));
                    gjoremal.setHusholdningId(rs2.getInt("husholdningId"));
                    gjoremal.setBeskrivelse(rs2.getString("beskrivelse"));
                    gjoremal.setGjoremalId(rs2.getInt("gjøremålId"));
                    gjoremal.setHhBrukerId(bruker.getBrukerId());
                    bruker.addGjoremal(gjoremal);
                }
                bruker.setPassord("");
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
        String passord = RandomGenerator.stringulns(PASSWORD_LENGTH);
        setNyttPassord(brukerId, passord);
        return passord;
    }

    /**
     * Skal bare brukes hvis man ikke har brukerId. Bruk ellers den andre metoden med samme navn.
     * Lagrer et nytt tilfeldig passord til brukeren med gitt epost
     * @param epost til brukeren som skal ha nytt passord
     * @return det nye tilfeldige passordet
     */
    public static String nyttTilfeldigPass(String epost) {
        String passord = RandomGenerator.stringulns(PASSWORD_LENGTH);
        String[] hashOgSalt = Encryption.instance.passEncoding(passord);
        String sqlSetning = "update " + TABELLNAVN + " set hash=?, salt=? where " + "epost=" + epost;
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlSetning)) {
            preparedStatement.setString(1, hashOgSalt[0]);
            preparedStatement.setString(2, hashOgSalt[1]);
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
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

    public static void setNyttNavn(int brukerId, String navn){ GenereltController.update(TABELLNAVN, "navn", navn, brukerId); }

    private double getBalanse(int brukerId) {
        return 0;
    }

    public static boolean setProfilbilde(Bruker bruker){
        String link = bruker.getProfilbilde();
        int id = bruker.getBrukerId();
        String setLink = "UPDATE bruker SET profilbilde = ? WHERE brukerId = ?";
        try(Connection con = ConnectionPool.getConnection()){
            PreparedStatement ps = con.prepareStatement(setLink);
            ps.setString(1,link);
            ps.setInt(2,id);
            ps.executeUpdate();
            return true;
        }catch (SQLException e ){
            e.printStackTrace();
        }
        return false;
    }

}
