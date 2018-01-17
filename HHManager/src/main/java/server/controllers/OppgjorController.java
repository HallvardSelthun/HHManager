package server.controllers;

import server.restklasser.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class OppgjorController {
    private static PreparedStatement ps;
    private static Statement s;
    private final static String TABELLNAVN = "bruker";


    public static String getBrukernavn (int brukerid) {
        return GenereltController.getString("navn", TABELLNAVN, brukerid);
    }

    public static String getFavoritthusholdning(int brukerid) {
        return GenereltController.getString("favorittHusholdning", TABELLNAVN, brukerid);
    }

    public static boolean slettOppgjor(int oppgjørId) {
        return GenereltController.slettRad("oppgjør",oppgjørId);
    }

    /**
     * Tar et ResultSet og legger informasjonen inn i et Oppgjør-objekt
     * @param oppgjørId Unik ID for å identifisere hvert oppgjør
     * @return Oppgjør Et fullt oppgjørsobjekt.
     */
    private static Oppgjør lagOppgjørObjekt(ResultSet tomOppgjør, int oppgjørId, ArrayList<Vare> varer) throws SQLException {

        Oppgjør oppgjør = new Oppgjør(oppgjørId);
        oppgjør.setUtleggerId(tomOppgjør.getInt("husholdningId"));
        oppgjør.setOppgjørId(tomOppgjør.getInt("skaperId"));
        oppgjør.setBeskrivelse(tomOppgjør.getString("navn"));
        //bruker denne metoden getInt fra GenereltController? Må jeg lage en med getDouble?
        //oppgjør.setSum(tomOppgjør.getInt("offentlig")==1); //Gjør om tinyInt til boolean (
        //oppgjør.setFrist(tomOppgjør.getDate("frist"));
        oppgjør.setVarer(varer);

        return oppgjør;
    }
}
