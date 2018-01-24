package server.services;

import server.controllers.GjoremalController;
import server.restklasser.Bruker;
import server.restklasser.Gjoremal;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;

/**
 * Created by BrageHalse on 10.01.2018.
 */
@Path("/gjoremalservice")
public class GjoremalService {

    @GET
    @Path("/{husholdningId}")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Gjoremal> hentFellesGjoremal(@PathParam("husholdningId") int husholdningId) {
        return GjoremalController.hentFellesGjoremal(husholdningId);
    }

    @POST
    @Path("/nyttgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagreMittGjoremal(Gjoremal gjoremal) {
        return GjoremalController.ny(gjoremal);
    }

    @POST
    @Path("/nyttfellesgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagreFellesGjoremal(Gjoremal gjoremal) {
        return GjoremalController.ny(gjoremal);
    }

    @PUT
    @Path("/fullfortfelles")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean fullfortFelles(Gjoremal gjoremal){
        return GjoremalController.fullfortFelles(gjoremal);
    }

    @PUT
    @Path("/fullfort")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean fullfort(Gjoremal gjoremal){
        return GjoremalController.fullfort(gjoremal);
    }

    @GET
    @Path("{brukerId}/varsler")
    @Produces(MediaType.APPLICATION_JSON)
    public Bruker hentVarsler(@PathParam("brukerId") int brukerId){
        return GjoremalController.hentVarselGjoremal(brukerId);
    }
}
