package server.services;
//import server.controllers.BrukerController;
import com.fasterxml.jackson.databind.deser.std.MapEntryDeserializer;
import server.controllers.BrukerController;
import server.restklasser.*;

import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

/**
 * Created by BrageHalse on 10.01.2018.
 *
 */
@Path("/BrukerService")
public class BrukerService {

    /** Henter en Bruker frå klienten, sjekker om eposten er i bruk om den ikkje er i bruk blir det registrert en ny bruker
     * i databasen og returnerer True, dersom eposten allerede er i bruk vil det bli returnert False
     * @param nyBruker ny brukerinformasjon
     * @return boolean True om det blir laget en ny bruker, False om eposten allerede er i bruk
     */

    @POST
    @Path("/registrer")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean registrerBruker(Bruker nyBruker){
        return BrukerController.registrerBruker(nyBruker);
    }


    /**
     * Sjekker om logindataene er riktige
     *
     * @param bruker data til brukeren
     * @return true hvis dataene er riktige
     */
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Bruker loginGodkjent(Bruker bruker){
        //må ha en plass der en finne ut om d e rett
        return BrukerController.loginOk(bruker.getEpost(), bruker.getPassord());
    }

    @DELETE
    @Path("/fjernBrukerFraHusholdning")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean slettFraHusholdning(Bruker bruker){
        return BrukerController.slettFraHusholdning(bruker.getBrukerId(), bruker.getFavHusholdning());
    }


    /**
     * Endrer favhusholdning i Databasen til brukerIden som er gitt
     * @param bruker
     */
    @PUT
    @Path("/nyFavHusholdning")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean setFavHusholdning(Bruker bruker){
        return BrukerController.setNyFavoritthusholdning(bruker.getBrukerId(), Integer.toString(bruker.getFavHusholdning()));
    }

    /**
     * Endrer Eposten i DataBasen til brukeren med gitt brukerId dersom eposten er
     * @param bruker er brukeren som skal endre eposten sinn
     * @return true hvis det gikk bra
     */
    @PUT
    @Path("/endreEpost")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean endreEpost(Bruker bruker){
        BrukerController.setNyEpost(bruker.getEpost(),(bruker.getBrukerId()));
        return false;
    }

    /**
     * Endrer passordet til brukeren
     * @param bruker -objekt med det nye passordet
     * @return true hvis det gikk bra
     */
    @PUT
    @Path("/endrePassord")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean endrePassord(Bruker bruker){
        BrukerController.setNyttPassord((bruker.getBrukerId()), bruker.getPassord());
        return false;
    }

    /**
     * Endrer navnet til brukeren
     * @param bruker -objekt med det nye navnet
     * @return true hvis det går bra
     */
    @PUT
    @Path("/endreNavn")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean endreNavn(Bruker bruker){
        BrukerController.setNyttNavn(
                (bruker.getBrukerId()), bruker.getNavn());
        return false;
    }


    @GET
    @Path("/{epost}/brukerData")
    @Produces(MediaType.APPLICATION_JSON)
    public Bruker getHhData(@PathParam("epost") String brukerEpost){
        return BrukerController.getBrukerData(brukerEpost);
    }

    /**
     * Gir beskjed til servereren at det skal genereres et nytt passord for brukeren og sendes en mail med det
     * @param epost eposten til brukeren
     */
    @PUT
    @Path("/glemtpassord")
    public void glemtPassordEpost(String epost) {
        BrukerController.sendGlemtPassordMail(epost);
    }
}
