package server.services;

import server.restklasser.*;
import server.controllers.UtleggController;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;

@Path("/utlegg")
public class UtleggService {

    /**
     * Henter utleggene for en bruker via brukerId
     *
     * @param brukerId er unik id for hver bruker i databasen.
     * @return ArrayList med utlegg for en bruker
     */
    @GET
    @Path("/{brukerId}")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Utlegg> getUtleggene(@PathParam("brukerId") int brukerId) {
        return UtleggController.getUtleggene(brukerId);
    }

    /**
     * Henter alle Oppgjor-objektene tilknyttet en bruker-ID
     *
     * @param brukerId er unik id for hver bruker i databasen.
     * @return ArrayList med Oppgjør. Inneholder to arrays av Utleggsbetaler for utlegg brukeren skylder og andre skylder brukeren
     */
    @GET
    @Path("/oppgjor/{brukerId}")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Oppgjor> getOppgjor(@PathParam("brukerId") int brukerId) {
        return UtleggController.getMineOppgjor(brukerId);
    }


    @PUT
    @Path("/{brukerId}/{utleggId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean setMotatt(@PathParam("brukerId") int brukerId, @PathParam("utleggId") int utleggId) {
        return UtleggController.setMotatt(brukerId, utleggId);
    }


    /*
     * Henter alle brukere som er involvert i et unikt utlegg.
     * @param utleggId er en unik id for å indentifisere utlegg.
     * @return ArrayList over alle utleggsbetalere for et unikt utlegg via utleggid
     */
    /*
    @GET
    @Path("/{utleggId}")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Utleggsbetaler> getUtleggsBetalere(@PathParam("utleggId") int utleggId) {
        return UtleggController.getUtleggsbetalere(utleggId);
    }*/
    @POST
    @Path("nyttutlegg")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean nyttutlegg(Utlegg utlegg){
        return UtleggController.lagNyttUtlegg(utlegg);
    }
}
