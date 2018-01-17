package server.controllers;

import server.database.ConnectionPool;
import server.restklasser.*;

import java.sql.*;
import java.util.ArrayList;

public class UtleggController {
    private static PreparedStatement ps;
    private static Statement s;
    private final static String TABELLNAVN = "bruker";


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
                utlegg.setUtleggerNavn(navn);
                utlegg.setFolkSomSkylderPenger(getUtleggsbetalere(utleggId,navn));
                utleggene.add(utlegg);
            }
            return utleggene;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static ArrayList<Utleggsbetaler> getUtleggsbetalere(int utleggId, String navn) {

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

    private static Utleggsbetaler lagUtleggsbetalerObjekt(ResultSet resultset) throws SQLException{
        Utleggsbetaler utleggsbetaler = new Utleggsbetaler ();
        utleggsbetaler.setSkyldigBrukerId(resultset.getInt("skyldigBrukerId"));
        utleggsbetaler.setBetalt(resultset.getInt("betalt")==1);
        utleggsbetaler.setDelSum(resultset.getDouble("delSum"));
        utleggsbetaler.setNavn(resultset.getString("navn"));
        utleggsbetaler.setBeskrivelse(resultset.getString("beskrivelse"));
        return utleggsbetaler;
    }

    //Krevet at ResultSet inneholder bruker-sql-data
    private static Oppgjor lagOppgjorObjekt(ResultSet resultset) throws SQLException{
        Oppgjor nyttOppgjor = new Oppgjor();
        nyttOppgjor.setNavn(resultset.getString("navn"));
        nyttOppgjor.setBrukerId(resultset.getInt("brukerId"));
        return nyttOppgjor;
    }


    //Utlegg jeg skylder folk for
    private static ArrayList<Oppgjor> getAlleOppgjorJegSkylder(int minBrukerId, Connection connection) {

        //Gir alle utleggere som jeg skylder penger, samt beløpet jeg skylder mm.
        String query = "SELECT * FROM (utlegg INNER JOIN utleggsbetaler ON utlegg.utleggId = utleggsbetaler.utleggId) INNER JOIN bruker ON utleggsbetaler.skyldigBrukerId = bruker.brukerId WHERE skyldigBrukerId = "+minBrukerId+""; //test med 2

        try (PreparedStatement statement = connection.prepareStatement(query)){
            ResultSet resultset = statement.executeQuery();

            Oppgjor nyttOppgjor = new Oppgjor();
            ArrayList<Utleggsbetaler> altJegSkylderDennePersonen = new ArrayList<>();

            Utleggsbetaler jegSkylder;
            ArrayList<Oppgjor> altJegSkylder = new ArrayList<>();
            int forrigeUtleggerId = -1;
            boolean forsteIterasjon = true;
            boolean hindreFakeOppgjor = false; //Selv om det ikke

            //**
            //NOTE TO SELF:
            //Hva skjer om jeg skylder samme kis uten at utleggene kommer i en hyggelig rekkefølge
            //i databasen? Dette må fikses.

            while (resultset.next()) {
                //Hvis vi legger til et noe jeg skylder til et eksisterende utlegg
                if ((resultset.getInt("utleggerId") == forrigeUtleggerId) || forsteIterasjon) {
                    forsteIterasjon = false;
                    hindreFakeOppgjor = true;
                }
                else {
                    //Hvis vi er ferdige med å legge til hva jeg skylder den første personen, gå videre til neste person
                    altJegSkylder.add(nyttOppgjor); //Men først, legg den gamle inn i altJegSkylder
                    forrigeUtleggerId = resultset.getInt("utleggerId");
                }
                nyttOppgjor = lagOppgjorObjekt(resultset);
                nyttOppgjor.getUtleggJegSkylder().add(lagUtleggsbetalerObjekt(resultset)); //Legg inn hva jeg skylder i oppgjøret
            }
            altJegSkylder.add(nyttOppgjor);
            System.out.println("Størrelsen på altJegSkylder: "+altJegSkylder.size());
            return altJegSkylder;

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    //Utlegg folk skylder meg for
    private static ArrayList<Oppgjor> appendAlleOppgjorFolkSkylderMeg(ArrayList<Oppgjor> eksisterendeOppgjor, int minBrukerId, Connection connection) throws SQLException{
        System.out.println("Nå er vi her");
        String query = "SELECT * FROM (utlegg INNER JOIN utleggsbetaler ON utlegg.utleggId = utleggsbetaler.utleggId) INNER JOIN bruker ON utleggsbetaler.skyldigBrukerId = bruker.brukerId WHERE utleggerId = "+minBrukerId+"";

        Utleggsbetaler skylderMeg = new Utleggsbetaler();

        try (PreparedStatement statement = connection.prepareStatement(query)){
            System.out.println("inne i try-block");
            ResultSet resultset = statement.executeQuery();
            int teller = 0;
            System.out.println("Rett før nå");
            while (resultset.next()) {
                System.out.println("OK!");
                System.out.println(teller);
                //Hvis jeg finner en skyldigBruker (person som skylder et oppgjør som jeg laget) i eksitsterende Oppgjør skal jeg legge inn hva han/hun skylder meg i oppgjøret hennes
                int fantMatchIndeks = -1;
                //Gå gjennom alle Oppgjør og se etter personen som skylder meg penger
                System.out.println("Eksisterendeoppgjør.size "+eksisterendeOppgjor.size());
                for (int i = 0; i < eksisterendeOppgjor.size(); i++) {
                    System.out.println("For løkke "+i);
                    if (resultset.getInt("skyldigBrukerId") == eksisterendeOppgjor.get(i).getBrukerId()) {
                        System.out.println("Fant match!");
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
                    Oppgjor nyttOppgjor = lagOppgjorObjekt(resultset);
                    nyttOppgjor.leggTilNyUtleggsbetalerSkylderMeg(lagUtleggsbetalerObjekt(resultset));
                    System.out.println("Eksisterende oppgjør sizzzee: "+eksisterendeOppgjor.size());
                    eksisterendeOppgjor.add(nyttOppgjor); //Oppgjør som bare inneholder at noen skylder meg penger, not the other way around
                }
                teller++;
            }
        }
        System.out.println("Eksisterende oppgjør sizzzdddee: "+eksisterendeOppgjor.size());
        return eksisterendeOppgjor;
    }

    public static ArrayList<Oppgjor> getMineOppgjor(int minBrukerId) {

            ArrayList<Oppgjor> mineOppgjor = new ArrayList<Oppgjor>();
            try (Connection connection = ConnectionPool.getConnection()) {

                mineOppgjor = getAlleOppgjorJegSkylder(minBrukerId, connection);
                System.out.println("mineOppgjor.size"+mineOppgjor.size());
                System.out.println("Vi er her");
                ArrayList<Oppgjor> mineOppgjorNy = appendAlleOppgjorFolkSkylderMeg(mineOppgjor,minBrukerId,connection);
                System.out.println("mineOppgjor.size "+mineOppgjor.size());

                return mineOppgjorNy;

                //Utlegg jeg skylder folk for
                //Gå inn i utleggsbetaler-tabellen og returer alle utlegg som har min skyldigBrukerId
                // - Sett sammen disse resultatene med utlegg-tabellen, slik at vi får utleggerIdene
                // - Disse utleggerIdene hører til folka jeg skylder penger
                // - Lag Oppgjør-objekter med vha. disse utleggerIdene
                // - For hver unike utleggerId, legg inn "utleggsbetaler" som har min skyldigBrukerId
                // - Nå har alle Oppgjør-objektene info om hva jeg skylder den personen

                //Utlegg folk skylder meg for
                //Select alle utlegg med min utleggerId fra utlegg-tabellen
                // - Inner join på utleggsbetaler på utleggId og få alle skyldigBrukerId samt utleggerId
                // - Sjekk om utleggerId matcher utleggerIder i Oppgjør-objektene
                // - Hvis en match finnes, lag nye Utleggsbetaler-objekter og legg dem inn i
                //   Arrayen
                // - Hvis vi ikke finner en match, lag nye Oppgjørs-objekter med alle skyldigBrukerId
                //   som ikke allerede finnes i Oppgjørs-objektene
                // - Legg inn alle utleggsbetaler i de nye Oppgjørs-objektene som har samme skyldigBrukerId
                //   som Oppgjørs-objektet

                //På denne måten vil noen oppgjør bare bestå av penger jeg skylder, noen bare penger
                //folk skylder meg, og noen med begge.

                //I JavaScript skal man kunne:


            } catch (SQLException e) {
                e.printStackTrace();
                return null;
            }
    }

    //På nettsiden vises brukerne, med utlegg
    //Utlegg.getSkylder()
    //Utlegg.getUtlegg()
    //Objekt: utleggsBruker
    //- ArrayList<Utlegg> utlegg
    //- ArrayList<Utlegg> skylder

    //Lage et utlegg:
    //Må lage et utlegg (legge inn utlegg i databasen)
    // - Lag en utleggsbetaler i databasen for hver betaler

}
