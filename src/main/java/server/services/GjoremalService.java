package server.services;

import server.controllers.GjoremalController;
import server.restklasser.Gjøremål;

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
    public ArrayList<Gjøremål> hentFellesGjøremål(@PathParam("husholdningId") int husholdningId) {
        return GjoremalController.hentFellesGjøremål(husholdningId);
    }

    @POST
    @Path("/nyttgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean lagreMittGjoremal(Gjøremål gjoremal) {
        return GjoremalController.ny(gjoremal);
    }

    @POST
    @Path("/nyttfellesgjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean lagreFellesGjoremal(Gjøremål gjoremal) {
        return GjoremalController.ny(gjoremal);
    }
}
