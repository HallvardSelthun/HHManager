package server.controllers;

import server.database.ConnectionPool;
import server.restklasser.*;

import javax.ws.rs.POST;
import java.sql.*;
import java.util.ArrayList;

public class UtleggController {
    private static PreparedStatement ps;
    private static Statement s;
    private final static String TABELLNAVN = "oppgjørsbetaler";


    public static String getBrukernavn (int brukerid) {
        return GenereltController.getString("navn", TABELLNAVN, brukerid);
    }

    public static String getFavoritthusholdning(int brukerid) {
        return GenereltController.getString("favorittHusholdning", TABELLNAVN, brukerid);
    }

    public static boolean slettOppgjor(int utleggId) {
        return GenereltController.slettRad("utlegg",utleggId);
    }

    /* Mulig denne metoden skal brukes, mulig den ikke trengs. -Toni
    /**
     * Tar et ResultSet og legger informasjonen inn i et utlegg-objekt
     * @param utleggId Unik ID for å identifisere hvert utlegg
     * @return utlegg Et fullt utleggsobjekt.
     */
    /*
    private static Utlegg lagutleggObjekt(ResultSet tomutlegg, int utleggId, ArrayList<Vare> varer) throws SQLException {

        Utlegg utlegg = new Utlegg(utleggId);
        utlegg.setUtleggerId(tomutlegg.getInt("husholdningId"));
        utlegg.setutleggId(tomutlegg.getInt("skaperId"));
        utlegg.setBeskrivelse(tomutlegg.getString("navn"));
        //bruker denne metoden getInt fra GenereltController? Må jeg lage en med getDouble?
        //utlegg.setSum(tomutlegg.getInt("offentlig")==1); //Gjør om tinyInt til boolean (
        //utlegg.setFrist(tomutlegg.getDate("frist"));
        utlegg.setVarer(varer);

        return utlegg;
    }
    */

    public static boolean setMotatt(int brukerId, int utleggId) {
        System.out.println("brukerId/skyldigBrukerId: "+brukerId+" utleggId: "+utleggId);
        String getQuery = "UPDATE utleggsbetaler JOIN bruker JOIN utlegg SET betalt = 1 WHERE skyldigBrukerId = "
                + brukerId + " AND utleggsbetaler.utleggId =  " + utleggId;

        try (Connection connection = ConnectionPool.getConnection()) {
            PreparedStatement updateStatment = connection.prepareStatement(getQuery);
            int success = updateStatment.executeUpdate();
            if (success == 1) {
                return true;
            }
            else {
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean setMotattOppgjor(ArrayList<Utleggsbetaler> utleggsbetalere) {
        boolean resultat = false;
        boolean altGikkGreit = true;

        System.out.println(utleggsbetalere.get(0).getSkyldigBrukerId());
        /*
        for (Utleggsbetaler element : utleggsbetalere) {
            resultat = setMotatt(element.getSkyldigBrukerId(),element.getutleggId());
            if (resultat == false) {
                altGikkGreit = false;
            }
        }

        return altGikkGreit;
        */
        return false;
    }


    /**
     * Henter alle utlegg som en brukerId har laget
     * @param brukerId er unik id for hver bruker i databasen.
     * @return ArrayList med Utlegg.
     */
    public static ArrayList<Utlegg> getUtleggene(int brukerId) {
        String getUtleggQuery = "SELECT * FROM utlegg WHERE utleggerId = "+brukerId+"";
        String navn = BrukerController.getNavn(brukerId);
        int teller = 0;

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getUtleggStatement = connection.prepareStatement(getUtleggQuery)){
            ResultSet resultset = getUtleggStatement.executeQuery();

            ArrayList<Utlegg> utleggene = new ArrayList<Utlegg>();

            while (resultset.next()) {
                int utleggId = resultset.getInt("utleggId");
                Utlegg utlegg = new Utlegg();
                utlegg.setBeskrivelse(resultset.getString("beskrivelse"));
                utlegg.setSum(resultset.getInt("sum"));
                utlegg.setUtleggerId(resultset.getInt("utleggerId"));
                utlegg.setUtleggId(utleggId);
                utleggene.add(utlegg);
            }
            return utleggene;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Hjelpemetode som gir en arraylist av Utleggsbetalere. De inneholder en skyldigBrukerId
     * samt summen som skyldes mm. Brukes ikke til noe atm.
     * @param utleggId er unik id for hvert utlegg i databasen
     * @return ArrayList med Utleggsbetaler.
     */
    private static ArrayList<Utleggsbetaler> getUtleggsbetalere(int utleggId) {

        String query = "SELECT * FROM utleggsbetaler WHERE utleggId = "+utleggId+"";
        ArrayList<Utleggsbetaler> utleggsbetalere = new ArrayList<Utleggsbetaler>();

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getUtleggStatement = connection.prepareStatement(query)){
            ResultSet resultset = getUtleggStatement.executeQuery();

            while (resultset.next()) {
                utleggsbetalere.add(lagUtleggsbetalerObjekt(resultset));
            }
            return utleggsbetalere;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Mye brukt hjelpemetode som lager en Utleggsbetaler ut ifra et ResultSet hentet fra
     * databasen
     * @param resultset SQL-resultset som inneholder all nødvendig informasjon til å lage et Utleggsbetaler-objekt
     * @return ArrayList med Utleggsbetaler.
     */
    private static Utleggsbetaler lagUtleggsbetalerObjekt(ResultSet resultset) throws SQLException{
        Utleggsbetaler utleggsbetaler = new Utleggsbetaler ();
        utleggsbetaler.setutleggId(resultset.getInt("utleggId"));
        utleggsbetaler.setSkyldigBrukerId(resultset.getInt("skyldigBrukerId"));
        utleggsbetaler.setBetalt(resultset.getInt("betalt")==1);
        utleggsbetaler.setDelSum(resultset.getDouble("delSum"));
        utleggsbetaler.setNavn(resultset.getString("navn"));
        utleggsbetaler.setBeskrivelse(resultset.getString("beskrivelse"));
        return utleggsbetaler;
    }

    /**
     * Hjelpemetode som lager et Oppgjor-objekt fra et ResultSet.
     * Tar også inne en boolean brukerenSkylderMeg, som bestemmer om om det er din eller
     * den som skylder deg sin ID som blir lagret som Oppgjørers brukerID.
     * Poenget med dette er:
     * Hvis noen skylder deg penger, skal deres ID lagres som oppgjørets brukerId
     * Hvis du skylder noen penger, skal deres ID (utleggerId på utlegget) lagres som oppgjørets brukerId
     * Slik er Oppgjøret knyttet til en annen person enn deg uansett.
     * @param resultset SQL-resultset som inneholder all nødvendig informasjon til å lage et Oppgjor-objekt
     * @param brukerenSkylderMeg true hvis man vil lagre den som skylder deg som Oppgjørets brukerId, false hvis den du skylder skal lagres
     * @return ArrayList med Utleggsbetaler.
     */
    private static Oppgjor lagOppgjorObjekt(ResultSet resultset, boolean brukerenSkylderMeg) throws SQLException{
        Oppgjor nyttOppgjor = new Oppgjor();
        nyttOppgjor.setNavn(resultset.getString("navn"));
        if (brukerenSkylderMeg) {
            nyttOppgjor.setBrukerId(resultset.getInt("skyldigBrukerId"));
        }
        else {
            nyttOppgjor.setBrukerId(resultset.getInt("utleggerId"));
        }
        return nyttOppgjor;
    }


    /**
     * Hjelpemetode. Må alltid kjøres før appendAlleOppgjorFolkSkylderMeg().
     * Tar utgangspunkt i brukerId og lager oppgjør som utelukkende består av
     * en ArrayList med Utleggsbetaler, der minBrukerId er utleggsbetaler.
     * Oppgjørenes brukerId er brukerne minBrukerId skylder penger.
     * @param minBrukerId Id til brukeren vi henter oppgjørene til
     * @param connection Sendes videre fra moder-metoden getMineOppgjør()
     * @return ArrayList med Utleggsbetaler.
     */
    private static ArrayList<Oppgjor> getAlleOppgjorJegSkylder(int minBrukerId, Connection connection) {

        //Gir alle utleggere som jeg skylder penger, samt beløpet jeg skylder mm.
        String query = "SELECT * FROM utlegg INNER JOIN utleggsbetaler ON utlegg.utleggId = utleggsbetaler.utleggId INNER JOIN bruker ON utlegg.utleggerId = bruker.brukerId WHERE skyldigBrukerId = "+minBrukerId+" ORDER BY utleggerId"; //test med 2

        try (PreparedStatement statement = connection.prepareStatement(query)){
            ResultSet resultset = statement.executeQuery();

            Oppgjor nyttOppgjor = new Oppgjor();
            ArrayList<Utleggsbetaler> altJegSkylderDennePersonen = new ArrayList<>();

            Utleggsbetaler jegSkylder;
            ArrayList<Oppgjor> altJegSkylder = new ArrayList<>();
            int forrigeUtleggerId = -1;
            boolean forsteIterasjon = true;
            boolean tomtOppgjor = true; //Selv om det ikke


            while (resultset.next()) {
                if (resultset.getInt("utleggerId")!=0) { //Sjekk om resultset er tomt
                    tomtOppgjor = false;
                    //Hvis vi legger til et noe jeg skylder til et eksisterende utlegg
                    if ((resultset.getInt("utleggerId") == forrigeUtleggerId) || forsteIterasjon) {
                        forsteIterasjon = false;

                    }
                    else {
                        //Hvis vi er ferdige med å legge til hva jeg skylder den første personen, gå videre til neste person
                        altJegSkylder.add(nyttOppgjor); //Men først, legg den gamle inn i altJegSkylder
                        forrigeUtleggerId = resultset.getInt("utleggerId");
                    }
                    nyttOppgjor = lagOppgjorObjekt(resultset, false);
                    nyttOppgjor.getUtleggJegSkylder().add(lagUtleggsbetalerObjekt(resultset)); //Legg inn hva jeg skylder i oppgjøret
                }
            }
            if (!tomtOppgjor) {
                altJegSkylder.add(nyttOppgjor);
            }
            return altJegSkylder;

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Hjelpemetode. Må alltid kjøres etter getAlleOppgjorJegSkylder().
     * Tar utgangspunkt i brukerId og Oppgjør-objektene getAlleOppgjorJegSkylder() laget
     * Legger så inn hva andre skylder "meg" (brukerIden vi sender inn) i de allerde
     * eksisterende Oppgjør-objektene (må være snakk om samme brukerIder som tidligere).
     * Hvis det ikke eksisterer oppgjør for folk som skylder meg penger, lages disse Oppgjørs-objektene
     * og det legges inn Utleggsbetaler-objekter for hvert utlegg de skylder meg penger for.
     * @param eksisterendeOppgjor Array av oppgjør laget av getAlleOppgjorJegSkylder()
     * @param minBrukerId Id til brukeren vi henter oppgjørene til
     * @param connection Sendes videre fra moder-metoden getMineOppgjør()
     * @return ArrayList med Utleggsbetaler.
     */
    private static ArrayList<Oppgjor> appendAlleOppgjorFolkSkylderMeg(ArrayList<Oppgjor> eksisterendeOppgjor, int minBrukerId, Connection connection) throws SQLException{
        String query = "SELECT * FROM (utlegg INNER JOIN utleggsbetaler ON utlegg.utleggId = utleggsbetaler.utleggId) INNER JOIN bruker ON utleggsbetaler.skyldigBrukerId = bruker.brukerId WHERE utleggerId = "+minBrukerId+"";

        Utleggsbetaler skylderMeg = new Utleggsbetaler();

        try (PreparedStatement statement = connection.prepareStatement(query)){
            ResultSet resultset = statement.executeQuery();

            while (resultset.next()) {
                //Hvis jeg finner en skyldigBruker (person som skylder et oppgjør som jeg laget) i eksitsterende Oppgjør skal jeg legge inn hva han/hun skylder meg i oppgjøret hennes
                int fantMatchIndeks = -1;
                //Gå gjennom alle Oppgjør og se etter personen som skylder meg penger
                for (int i = 0; i < eksisterendeOppgjor.size(); i++) {
                    if (resultset.getInt("skyldigBrukerId") == eksisterendeOppgjor.get(i).getBrukerId()) {
                        fantMatchIndeks = i;
                        //Vi fant noen som skylder meg penger som allerede har et Oppgjør knyttet til seg
                    }
                }
                if (fantMatchIndeks > -1) {
                    //Legg inn det de skylder meg:
                    Utleggsbetaler denSkylderMeg = lagUtleggsbetalerObjekt(resultset);
                    eksisterendeOppgjor.get(fantMatchIndeks).leggTilNyUtleggsbetalerSkylderMeg(denSkylderMeg);
                }
                //Gikk gjennom alle oppgjør uten å finne et laget av han/hun som skylder meg penger
                else {
                    Oppgjor nyttOppgjor = lagOppgjorObjekt(resultset, true);
                    nyttOppgjor.leggTilNyUtleggsbetalerSkylderMeg(lagUtleggsbetalerObjekt(resultset));
                    eksisterendeOppgjor.add(nyttOppgjor); //Oppgjør som bare inneholder at noen skylder meg penger, not the other way around
                }
            }
        }
        return eksisterendeOppgjor;
    }


    /**
     * Tar inn en brukerId og returnerer en array med Oppgjør-objekter.
     * Hvert oppgjør-objekt inneholder BrukerIden til en person man enten skylder penger, den skylder deg,
     * eller begge. Hvor mye som skyldes lagres i to ArrayLists med "Utleggsbetaler"-objekter.
     * @param minBrukerId ID til brukeren som vi henter oppgjørene til
     * @return Array med alle pågående oppgjør
     */
    public static ArrayList<Oppgjor> getMineOppgjor(int minBrukerId) {

            ArrayList<Oppgjor> mineOppgjor = new ArrayList<Oppgjor>();
            try (Connection connection = ConnectionPool.getConnection()) {

                mineOppgjor = getAlleOppgjorJegSkylder(minBrukerId, connection);
                ArrayList<Oppgjor> mineOppgjorNy = appendAlleOppgjorFolkSkylderMeg(mineOppgjor,minBrukerId,connection);

                return mineOppgjorNy;

            } catch (SQLException e) {
                e.printStackTrace();
                return null;
            }
    }


    public static boolean lagNyttUtlegg(Utlegg utlegg){
        String query = "INSERT INTO utlegg (utleggerId, sum, beskrivelse) VALUES (?,?,?)";
        String getId = "SELECT LAST_INSERT_ID()";
        int utleggId;
        String addUtleggsbetaler = "INSERT INTO utleggsbetaler (utleggId, skyldigBrukerId, delSum) VALUES (?,?,?)";
        try(Connection con = ConnectionPool.getConnection()){
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, utlegg.getUtleggerId());
            ps.setDouble(2, utlegg.getSum());
            ps.setString(3, utlegg.getBeskrivelse());
            ps.execute();
            ps = con.prepareStatement(getId);
            ResultSet rs = ps.executeQuery();
            rs.next();
            utleggId = rs.getInt(1);
            for (int i = 0; i < utlegg.utleggsbetalere.size(); i++) {
                ps = con.prepareStatement(addUtleggsbetaler);
                ps.setInt(1,utleggId);
                ps.setInt(2,utlegg.utleggsbetalere.get(i).getSkyldigBrukerId());
                ps.setDouble(3, utlegg.utleggsbetalere.get(i).getDelSum());
                ps.execute();
            }
            return true;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }
}
