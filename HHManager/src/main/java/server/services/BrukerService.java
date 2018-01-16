package server.services;
//import server.controllers.BrukerController;
import server.controllers.BrukerController;
import server.restklasser.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by BrageHalse on 10.01.2018.
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


    /*
    @PUT
    @Path("/{brukerId}/endrePassord")
    @Consumes(MediaType.TEXT_PLAIN)
    public boolean setNewPassword(@PathParam("brukerId") String brukerId, String gammeltPassord, String nyttPassord){
        // sjekker om det gamle paassordet er likt det som er lagret i databasen, dersom det er likt skal det gamle
        // passordet i databasen bli erstattet med det nye og returnere true
        return false;
    }
    */

    /**
     * Endrer favhusholdning i Databasen til brukerIden som er gitt
     * @param brukerId
     * @param favHusholdningsId
     */
    @PUT
    @Path("/{brukerId}/favHusholdning")
    @Consumes(MediaType.TEXT_PLAIN)
    public void setFavHusholdning(@PathParam("brukerId") String brukerId, String favHusholdningsId){
        BrukerController.setNyFavoritthusholdning(brukerId, favHusholdningsId);
    }

    /**
     * Endrer Eposten i DataBasen til brukeren med gitt brukerId dersom eposten er
     * @param nyEpos
     * @return
     */
    @PUT
    @Path("/{brukerId}/endreEpost")
    @Consumes(MediaType.TEXT_PLAIN)
    public boolean endreEpost(@PathParam("brukerId") String brukerId ,String nyEpos){
        BrukerController.setNyEpost(nyEpos, brukerId);
        // sjekk om den nye Epostadressa innholder @ , . , com/no. Dersom epostadressen er gyldig skal Epostadressen i
        // Databasen der brukerIden er lik den som gitt i parameteret
        return false;
    }

    @PUT
    @Path("/endrePassord")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean endrePassord(Bruker bruker){
        BrukerController.setNyttPassord(Integer.toString(bruker.getBrukerId()), bruker.getPassord());
        return false;
    }

    @GET
    @Path("/{epost}/brukerData")
    @Produces(MediaType.APPLICATION_JSON)
    public Bruker getHhData(@PathParam("epost") String brukerEpost){
        return BrukerController.getBrukerData(brukerEpost);
    }
}
