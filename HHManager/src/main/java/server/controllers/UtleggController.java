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

    public static ArrayList<Utleggsbetaler> getUtleggsbetalere(int utleggId, String navn) {

        String query = "SELECT * FROM utleggsbetaler WHERE utleggId = "+utleggId+"";
        ArrayList<Utleggsbetaler> utleggsbetalere = new ArrayList<Utleggsbetaler>();

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getUtleggStatement = connection.prepareStatement(query)){
            ResultSet resultset = getUtleggStatement.executeQuery();

            while (resultset.next()) {
                Utleggsbetaler utleggsbetaler = new Utleggsbetaler ();
                utleggsbetaler.setSkyldigBrukerId(resultset.getInt("skyldigBrukerId"));
                utleggsbetaler.setBetalt(resultset.getInt("betalt")==1);
                utleggsbetaler.setDelSum(resultset.getDouble("delSum"));
                utleggsbetaler.setNavn(navn);
                utleggsbetalere.add(utleggsbetaler);
            }
            return utleggsbetalere;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    //På nettsiden vises brukerne, med utlegg
    //Bruker.getSkylder()
    //Bruker.getUtlegg()
    //Objekt: utleggsBruker
    //- ArrayList<Utlegg> utlegg
    //- ArrayList<Utlegg> skylder

    //Lage et utlegg:
    //Må lage et utlegg (legge inn utlegg i databasen)
    // - Lag en utleggsbetaler i databasen for hver betaler

}
