package server.controllers;

import com.mysql.cj.jdbc.util.ResultSetUtil;
import com.sun.org.apache.regexp.internal.RE;
import server.Mail;
//import com.mysql.cj.jdbc.util.ResultSetUtil;
import server.database.ConnectionPool;
import server.util.RandomGenerator;
import server.restklasser.*;

import javax.swing.plaf.nimbus.State;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.sql.*;

public class HusholdningController {
    private static final String TABELLNAVN = "husholdning";
    private static PreparedStatement ps;
    private static Statement s;

    public static String getNavn(int id) {
        return GenereltController.getString("navn", TABELLNAVN, id);
    }
    /**
     * IKKE FERDIG.
     *
     * @param rName Den tilfeldige stringen som skal søkes etter
     * @return id til string
     */
    private static int getId(String rName) {
        String sqlsetning = "select husholdningId from husholdning where navn=" + rName;
        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)) {
            ResultSet resultSet = preparedStatement.executeQuery();
            resultSet.next();
            return resultSet.getInt("husholdningId");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }
    public static ArrayList<Husholdning> getAlleHusholdninger () {
        String selectAll = "select * from husholdning";
        String selectHandlelister = "SELECT * FROM husholdning " +
                "LEFT JOIN handleliste on handleliste.husholdningId = husholdning.husholdningId ORDER BY husholdning.husholdningId";
        String selectGjoremal = "SELECT * " +
                "FROM husholdning " +
                "LEFT JOIN gjøremål on husholdning.husholdningId = gjøremål.husholdningId ORDER BY husholdning.husholdningId;";
        String selectNyhetsinnlegg = "SELECT * " +
                "FROM husholdning " +
                "LEFT JOIN nyhetsinnlegg ON husholdning.husholdningId = nyhetsinnlegg.husholdningId ORDER BY husholdning.husholdningId";

        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement prepHus = connection.prepareStatement(selectAll);
            PreparedStatement prepHandlelister = connection.prepareStatement(selectHandlelister);
            PreparedStatement prepGjoremal = connection.prepareStatement(selectGjoremal);
            PreparedStatement prepNyhetsinnlegg = connection.prepareStatement(selectNyhetsinnlegg)) {

            // select * from husholdning
            ResultSet resultSet = prepHus.executeQuery();
            ArrayList<Husholdning> husArray = new ArrayList<>();
            while (resultSet.next()) {
                Husholdning husholdning = new Husholdning();
                husholdning.setHusholdningId(resultSet.getInt(1));
                husholdning.setNavn(resultSet.getString(2));
                husArray.add(husholdning);
            }

            // legger til alle handlelister
            resultSet = prepHandlelister.executeQuery();
            int i = 0;
            ArrayList<Handleliste> handlelister = new ArrayList<>();;
            while (resultSet.next()) { // itererer gjennom resultsettet
                Husholdning husholdning = husArray.get(i);
                Handleliste handleliste;
                if (husholdning.getHusholdningId() == resultSet.getInt(1)) {
                    handleliste = new Handleliste();
                    handleliste.setHusholdningId(husholdning.getHusholdningId());
                    handleliste.setFrist(resultSet.getDate(5));
                    handleliste.setOffentlig(resultSet.getBoolean(6));
                    handleliste.setTittel(resultSet.getString(7));
                    handleliste.setSkaperId(resultSet.getInt(8));
                    handlelister.add(handleliste);
                    continue;
                }
                husholdning.setHandlelister(handlelister);
                if (husholdning.getHusholdningId() < resultSet.getInt(1)){
                    for (; i < husArray.size(); i++) {
                        husholdning = husArray.get(i);
                        if (husholdning.getHusholdningId() == resultSet.getInt(1))
                            break;
                    }
                }
            }

            // legger til alle gjøremål
            resultSet = prepGjoremal.executeQuery();
            i = 0;
            ArrayList<Gjøremål> gjøremåls;
            while (resultSet.next()) { // itererer gjennom resultsettet
                gjøremåls = new ArrayList<>();
                Husholdning husholdning = husArray.get(i);
                Gjøremål gjoremal;
                if (resultSet.getString(3) == null) continue;
                if (husholdning.getHusholdningId() == resultSet.getInt(1)) {
                    gjoremal = new Gjøremål();
                    gjoremal.setHusholdningId(resultSet.getInt(1));
                    gjoremal.setGjøremålId(resultSet.getInt(3));
                    gjoremal.setHhBrukerId(resultSet.getInt(5));
                    gjoremal.setFullført(resultSet.getBoolean(6));
                    gjoremal.setBeskrivelse(resultSet.getString(7));
                    gjoremal.setFrist(resultSet.getDate(8));
                    gjøremåls.add(gjoremal);
                    continue;
                }
                husholdning.setGjøremål(gjøremåls);
                if (husholdning.getHusholdningId() < resultSet.getInt(1)){
                    for (; i < husArray.size(); i++) {
                        husholdning = husArray.get(i);
                        if (husholdning.getHusholdningId() == resultSet.getInt(1))
                            break;
                    }
                }
            }

            // legger til nyhetsinnlegg
            resultSet = prepNyhetsinnlegg.executeQuery();
            i = 0;
            ArrayList<Nyhetsinnlegg> nyhetsinnleggs;
            while (resultSet.next()) { // itererer gjennom resultsettet
                nyhetsinnleggs = new ArrayList<>();
                Husholdning husholdning = husArray.get(i);
                Nyhetsinnlegg nyhetsinnlegg;
                if (resultSet.getString(3) == null) continue;
                if (husholdning.getHusholdningId() == resultSet.getInt(1)) {
                    nyhetsinnlegg = new Nyhetsinnlegg();
                    nyhetsinnlegg.setHusholdningId(resultSet.getInt(1));
                    nyhetsinnlegg.setNyhetsinnleggId(resultSet.getInt(3));
                    nyhetsinnlegg.setTekst(resultSet.getString(5));
                    nyhetsinnlegg.setDato(resultSet.getDate(6));
                    nyhetsinnlegg.setForfatterId(resultSet.getInt(7));
                    nyhetsinnleggs.add(nyhetsinnlegg);
                    continue;
                }
                husholdning.setNyhetsinnlegg(nyhetsinnleggs);
                if (husholdning.getHusholdningId() < resultSet.getInt(1)){
                    for (; i < husArray.size(); i++) {
                        husholdning = husArray.get(i);
                        if (husholdning.getHusholdningId() == resultSet.getInt(1))
                            break;
                    }
                }
            }

            // har en liste over alle gjøremål. Disse må være sortert etter husId. Det er de pga autoinkrement
            // går gjennom resultsettet og legger linjen til det riktige huselementet
            //      Har det første objektet
            //      Sjekker om ID-en til objektet matcher nummeret i resultsettet
            //      Hvis ja -- legger data til objektet. Går til neste linje i rs.
            //      Hvis rs nei og høyere -- går til neste objekt
            //      catch array out of bounds ex ved å bare si seg ferdig og gå videre

            // legger til nyhetsinnlegg
            resultSet = prepNyhetsinnlegg.executeQuery();
            i = 0;
            ArrayList<Bruker> hhMedlems;
            while (resultSet.next()) { // itererer gjennom resultsettet
                hhMedlems = new ArrayList<>();
                Husholdning husholdning = husArray.get(i);
                Bruker hhMedlem;
                if (resultSet.getString(3) == null) continue;
                if (husholdning.getHusholdningId() == resultSet.getInt(1)) {
                    hhMedlem = new Bruker();
                    hhMedlem.setBrukerId(resultSet.getInt(3));
                    hhMedlems.add(hhMedlem);
                    continue;
                }
                husholdning.setMedlemmer(hhMedlems);
                if (husholdning.getHusholdningId() < resultSet.getInt(1)){
                    for (; i < husArray.size(); i++) {
                        husholdning = husArray.get(i);
                        if (husholdning.getHusholdningId() == resultSet.getInt(1))
                            break;
                    }
                }
            }

            return husArray;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    private static Husholdning finnHusholdning(ArrayList<Husholdning> husholdningArrayList, int id) {
        for (Husholdning h :
                husholdningArrayList) {
            if (h.getHusholdningId() == id) return h;
        }
        return null;
    }

    /**
     * Lager en ny husholdning og registrerer brukerne ved oppstart
     *
     * @param husholdning er nye husholdningen
     * @return IDen til den nye husholdningen
     */
    public static int ny(Husholdning husholdning) {
        String navnHus = husholdning.getNavn();
        ArrayList<String> nyeMedlemmerEpost = new ArrayList<>();
        for (Bruker bruker :
                husholdning.getMedlemmer()) {
            nyeMedlemmerEpost.add(bruker.getEpost());
        }
        String adminId = husholdning.getAdminId();

        StringBuilder selectAllerBrukereSB = new StringBuilder("SELECT epost from bruker WHERE epost in (");
        StringBuilder insertNyeBrukereSB = new StringBuilder("insert into bruker (epost) values ");
        StringBuilder selectIdBrukereSB = new StringBuilder("select brukerId from bruker where epost in (");
        String insertHus = "insert into " + TABELLNAVN + " (navn) values (?)";
        StringBuilder insertBrukereIHusSB = new StringBuilder("insert into hhmedlem (brukerId, husholdningId) values ");

        int husId;
        ArrayList<Integer> idBrukereAL = new ArrayList<>();

        try (Connection connection = ConnectionPool.getConnection()) {

            if (nyeMedlemmerEpost.size() > 0) {
                // finner brukere som allerede finnes og de som ikke finnes
                for (int i = 0; i < nyeMedlemmerEpost.size(); i++) {
                    selectAllerBrukereSB.append("?, ");
                }
                slettSisteTegn(selectAllerBrukereSB, 2); // fjerner ', ', altså to siste tegn i strengen
                selectAllerBrukereSB.append(")");
                PreparedStatement prepSelectAllerBrukere = connection.prepareStatement(selectAllerBrukereSB.toString());
                for (int i = 0; i < nyeMedlemmerEpost.size(); i++) {
                    prepSelectAllerBrukere.setString(i + 1, nyeMedlemmerEpost.get(i));
                }
                ResultSet allerBrukereRS = prepSelectAllerBrukere.executeQuery(); // kjører selectsetningen
                ArrayList<String> alleredeBrukereAL = new ArrayList<>();
                while (allerBrukereRS.next()) {
                    alleredeBrukereAL.add(allerBrukereRS.getString(1));
                }
                ArrayList<String> ikkeBrukerAl = new ArrayList<>(nyeMedlemmerEpost);
                ikkeBrukerAl.removeAll(alleredeBrukereAL);
                prepSelectAllerBrukere.close();

                // setter inn alle brukere som ikke finnes
                if (ikkeBrukerAl.size() > 0) {
                    for (int i = 0; i < ikkeBrukerAl.size(); i++) {
                        insertNyeBrukereSB.append("(?), ");
                    }
                    slettSisteTegn(insertNyeBrukereSB, 2);

                    PreparedStatement prepInsertNyeBrukere = connection.prepareStatement(insertNyeBrukereSB.toString());
                    for (int i = 0; i < ikkeBrukerAl.size(); i++) {
                        prepInsertNyeBrukere.setString(i + 1, ikkeBrukerAl.get(i));
                    }
                    prepInsertNyeBrukere.executeUpdate();
                    prepInsertNyeBrukere.close();
                }

                //henter ut alle brukeridene som trengs
                for (int i = 0; i < nyeMedlemmerEpost.size(); i++) {
                    selectIdBrukereSB.append("?, ");
                }
                slettSisteTegn(selectIdBrukereSB, 2);
                selectIdBrukereSB.append(")");
                PreparedStatement prepSelectIdBrukere = connection.prepareStatement(selectIdBrukereSB.toString());
                for (int i = 0; i < nyeMedlemmerEpost.size(); i++) {
                    prepSelectIdBrukere.setString(i + 1, nyeMedlemmerEpost.get(i));
                }
                ResultSet idBrukereRS = prepSelectIdBrukere.executeQuery();
                while (idBrukereRS.next()) idBrukereAL.add(idBrukereRS.getInt(1));
                prepSelectIdBrukere.close();
            }

            // legger til husholdning og henter ut Id
            PreparedStatement prepInsertHus = connection.prepareStatement(insertHus, PreparedStatement.RETURN_GENERATED_KEYS);
            prepInsertHus.setString(1, navnHus);
            prepInsertHus.executeUpdate();
            ResultSet idHusRS = prepInsertHus.getGeneratedKeys();
            idHusRS.next();
            husId = idHusRS.getInt(1);
            prepInsertHus.close();

            // legger til alle brukerne i husholdningen
            if (nyeMedlemmerEpost.size() > 0) {
                for (int i = 0; i < nyeMedlemmerEpost.size(); i++) {
                    insertBrukereIHusSB.append("(?, ?), ");
                }
                slettSisteTegn(insertBrukereIHusSB, 2);
                String insertBrukereIHusS = insertBrukereIHusSB.toString();
                PreparedStatement prepInsertBrukereIHus = connection.prepareStatement(insertBrukereIHusS);
                int j = 0;
                for (int i = 0; i < nyeMedlemmerEpost.size() * 2; i += 2) {
                    prepInsertBrukereIHus.setString(i + 1, Integer.toString(idBrukereAL.get(j)));
                    prepInsertBrukereIHus.setString(i + 2, Integer.toString(husId));
                    j++;
                }
                prepInsertBrukereIHus.executeUpdate();
                prepInsertBrukereIHus.close();
            }

            // setter admin på husstand
            String adminSqlsetning = "update hhmedlem set admin=1 where brukerId=? and husholdningId=?";
            PreparedStatement prepAdmin = connection.prepareStatement(adminSqlsetning);
            prepAdmin.setString(1, adminId);
            prepAdmin.setString(2, Integer.toString(husId));

            //Mail.sendny(ikkeBruker);
            //Mail.sendGamle(alleredeBrukereAL);
            return husId;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }

    }

    /**
     * Endrer navn på en husholdning gitt id.
     *
     * @param id
     * @param nyttNavn
     */
    public static void endreNavn(int id, String nyttNavn) {
        String sqlsetning = "update " + TABELLNAVN + " set navn = ? where husholdningid = ?";
        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)) {
            preparedStatement.setString(1, nyttNavn);
            preparedStatement.setString(2, Integer.toString(id));
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Sletter husholdning gitt id
     *
     * @param id
     */
    public static boolean slett(int id) {
        String sqlsetning = "DELETE FROM " + TABELLNAVN +
                " WHERE husholdningId = ?";
        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)) {
            preparedStatement.setString(1, Integer.toString(id));
            int count = preparedStatement.executeUpdate();
            if (count < 1) return false;
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Henter ut dataene til favoritthusholdningen til en bruker
     * @param husholdningId aktuell husholdningid
     * @return dataene til favoritthusholdningen
     */
    public static Husholdning getFavHusholdningData(int husholdningId){
        Husholdning huset = new Husholdning();
        int fav = husholdningId;
        huset.setHusholdningId(fav);
        int brukerId = 0;
        int handlelisteId = 0;
        //String hentFav = "SELECT favorittHusholdning, brukerId FROM bruker WHERE epost = ?";

        try (Connection con = ConnectionPool.getConnection()) {
            /*ps = con.prepareStatement(hentFav);
            ps.setString(1, epost);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    fav = rs.getInt("favorittHusholdning");
                    brukerId = rs.getInt("brukerId");
                    if (fav == 0) {
                        return null;
                    }
                    huset.setHusholdningId(fav);
                }
            }*/
            String hentHus = "SELECT * FROM husholdning WHERE husholdningId = " + fav;
            String hentNyhetsinnlegg = "SELECT * FROM nyhetsinnlegg WHERE husholdningId = " + fav;
            String hentAlleMedlemmer = "SELECT navn, bruker.brukerId FROM hhmedlem LEFT JOIN bruker ON bruker.brukerId = hhmedlem.brukerId WHERE husholdningId = " + fav;
            String hentHandleliste = "SELECT navn, handlelisteId FROM handleliste WHERE husholdningId = " + fav + " AND (offentlig = 1 OR skaperId = " + brukerId + ")";

            s = con.createStatement();
            ResultSet rs = s.executeQuery(hentHus);
            while (rs.next()) {
                String husNavn = rs.getString("navn");
                huset.setNavn(husNavn);
            }

            s = con.createStatement();
            rs = s.executeQuery(hentNyhetsinnlegg);
            while (rs.next()) {
                Nyhetsinnlegg nyhetsinnlegg = new Nyhetsinnlegg();
                nyhetsinnlegg.setNyhetsinnleggId(rs.getInt("nyhetsinnleggId"));
                nyhetsinnlegg.setTekst(rs.getString("tekst"));
                nyhetsinnlegg.setDato(rs.getDate("dato"));
                nyhetsinnlegg.setForfatterId(rs.getInt("forfatterId"));
                nyhetsinnlegg.setHusholdningId(fav);
                huset.addNyhetsinnlegg(nyhetsinnlegg);
            }


            s = con.createStatement();
            rs = s.executeQuery(hentAlleMedlemmer);
            while (rs.next()) {
                Bruker bruker = new Bruker();
                bruker.setNavn(rs.getString("navn"));
                bruker.setBrukerId(rs.getInt("brukerId"));
                huset.addMedlem(bruker);
            }
            Handleliste handleliste = new Handleliste();
            s = con.createStatement();
            rs = s.executeQuery(hentHandleliste);
            rs.next();

            handleliste.setTittel(rs.getString("navn"));
            handleliste.setHandlelisteId(rs.getInt("handlelisteId"));
            handleliste.setHusholdningId(fav);
            handleliste.setOffentlig(true);
            huset.addHandleliste(handleliste);
            handlelisteId = rs.getInt("handlelisteId");

            String hentVarer = "SELECT vareNavn, kjøpt FROM vare WHERE handlelisteId = " + handlelisteId;

            s = con.createStatement();
            rs = s.executeQuery(hentVarer);
            while (rs.next()) {
                Vare vare = new Vare();
                vare.setHandlelisteId(handlelisteId);
                vare.setVarenavn(rs.getString("vareNavn"));
                int i = rs.getInt("kjøpt");
                if (i == 1) {
                    vare.setKjøpt(true);
                } else {
                    vare.setKjøpt(false);
                }
                handleliste.addVarer(vare);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return huset;
    }

    /**
     * Hjelpemetode som henter navnet til brukere som er knyttet til en gitt husholdning.
     * @param husholdningsId id som skiller husholdningene fra hverandre.
     * @param connection Databaseconnection.
     * @return ArrayList av brukere med navn.
     */

    private static ArrayList<Bruker> getMedlemmer(int husholdningsId, Connection connection) {
        final String getQuery = "SELECT bruker.navn FROM bruker LEFT JOIN hhmedlem h ON bruker.brukerId = h.brukerId WHERE h.husholdningId =" + husholdningsId;
        ArrayList<Bruker> medlemmer = new ArrayList<>();

        try(PreparedStatement getMedlemStatement = connection.prepareStatement(getQuery)){
            ResultSet medlemRS = getMedlemStatement.executeQuery();
            while (medlemRS.next()) {
                Bruker nyMedlem = new Bruker();
                nyMedlem.setNavn(medlemRS.getString("navn"));
                medlemmer.add(nyMedlem);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return medlemmer;
    }

    /**
     * Hjelpemetode for å lage Husholdningsobjekter
     * @param tomHusholdning ResultSet med tomHusholdning.
     * @param husholdningsId int id som skiller husholdninger fra hverandre
     * @param medlemmer ArrayList med medlemmer for den gitte husholdningen
     * @return et Husholdningsobjekt.
     * @throws SQLException
     */

    private static Husholdning lagHusholdningsObjekt(ResultSet tomHusholdning, int husholdningsId, ArrayList<Bruker> medlemmer) throws SQLException {
        Husholdning husholdning = new Husholdning();
        husholdning.setHusholdningId(tomHusholdning.getInt("husholdningId"));
        husholdning.setMedlemmer(medlemmer);

        return husholdning;
    }

    /**
     * Metoden henter en liste over alle husholdninger med medlemmer for en gitt brukerId.
     * @param brukerId er en int som indentifiserer hver bruker unikt.
     * @return ArrayList med Husholdningsobjekter.
     */
    public static ArrayList<Husholdning> getHusholdninger(int brukerId) {
        final String getQuery = "SELECT navn, hus.husholdningId FROM husholdning hus LEFT JOIN hhmedlem h ON hus.husholdningId = h.husholdningId WHERE h.brukerId = " + brukerId;
        ArrayList<Husholdning> husholdninger = new ArrayList<>();

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getStatement = connection.prepareStatement(getQuery)) {
            ResultSet tomHusholdning = getStatement.executeQuery();

            while(tomHusholdning.next()) {
                ArrayList<Bruker> medlemmer = new ArrayList<>();

                Husholdning husholdning = new Husholdning();
                int husholdningsId = tomHusholdning.getInt("husholdningId");
                husholdning.setNavn(tomHusholdning.getString("navn"));
                husholdning.setHusholdningId(husholdningsId);
                medlemmer = getMedlemmer(husholdningsId, connection);
                husholdning.setMedlemmer(medlemmer);
                husholdninger.add(husholdning);
            }
            return husholdninger;

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    static void slettSisteTegn(StringBuilder stringBuilder, int antTegn) {
        stringBuilder.delete(stringBuilder.length() - antTegn, stringBuilder.length());
    }

    public static boolean postNyhetsinnlegg(Nyhetsinnlegg nyhetsinnlegg) {
        int husholdningId = nyhetsinnlegg.getHusholdningsId();
        int forfatterId = nyhetsinnlegg.getForfatterId();
        Date dato = nyhetsinnlegg.getDato();
        String tekst = nyhetsinnlegg.getTekst();
        String query = "INSERT INTO nyhetsinnlegg (forfatterId, husholdningId, dato, tekst) VALUES (?, ?, ?, ?)";

        try (Connection con = ConnectionPool.getConnection()) {
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, forfatterId);
            ps.setInt(2, husholdningId);
            ps.setDate(3, dato);
            ps.setString(4, tekst);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
