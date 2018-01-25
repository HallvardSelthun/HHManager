package server.services;

import server.controllers.GjoremalController;
import server.restklasser.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;

/**
 * Created by BrageHalse on 10.01.2018.
 */
@Path("/gjoremalservice")
public class GjoremalService {
    /**
     * Tar imot IDen til handlelisten fra klienten (i URLen).
     * @return String Det nye navnet, hentet fra databasen
     */
    @GET
    @Path("/{husholdningId}")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Gjoremal> hentFellesGjoremal(@PathParam("husholdningId") int husholdningId) {
        return GjoremalController.hentFellesGjoremal(husholdningId);
    }

    /**
     * Sender nytt gjøremål til database
     * @param gjoremal
     * @return nytt gjøremål
     */
    @POST
    @Path("/nyttgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagreMittGjoremal(Gjoremal gjoremal) {
        return GjoremalController.ny(gjoremal);
    }

    /**
     * Sender nytt felles gjøremål til database
     * @param gjoremal
     * @return
     */
    @POST
    @Path("/nyttfellesgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagreFellesGjoremal(Gjoremal gjoremal) {
        return GjoremalController.ny(gjoremal);
    }

    /**
     * Endrer slik at fullførte felles gjøremål oppdateres i database
     * @param gjoremal som parameter
     * @return fullførtegjøremål
     */
    @PUT
    @Path("/fullfortfelles")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean fullfortFelles(Gjoremal gjoremal){
        return GjoremalController.fullfortFelles(gjoremal);
    }

    /**
     * Endrer fullførte egne gjøremål
     * @param gjoremal som parameter er gjøremål
     * @return gjøremålet som er fullført
     */
    @PUT
    @Path("/fullfort")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean fullfort(Gjoremal gjoremal){
        return GjoremalController.fullfort(gjoremal);
    }

    /**
     * Henter varsler fra database
     * @param brukerId som parameter for å knytte en varsel til en bruker
     * @return henter varsel
     */
    @GET
    @Path("{brukerId}/varsler")
    @Produces(MediaType.APPLICATION_JSON)
    public Bruker hentVarsler(@PathParam("brukerId") int brukerId){
        return GjoremalController.hentVarselGjoremal(brukerId);
    }
}
