package server.controllers;

import server.restklasser.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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

    /**
     * Tar et ResultSet og legger informasjonen inn i et utlegg-objekt
     * @param utleggId Unik ID for å identifisere hvert utlegg
     * @return utlegg Et fullt utleggsobjekt.
     */
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

    public static ArrayList<Utlegg> getUtleggene(int brukerId) {
        String getQuery = "SELECT * FROM utlegg WHERE utleggerId = "+brukerId+"";
        return null;
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
