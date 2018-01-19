package server.services;

import server.controllers.GjoremalController;
import server.restklasser.Gjøremål;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

/**
 * Created by BrageHalse on 10.01.2018.
 */
public class GjøremålService {
    @POST
    @Path("/LeggTilGjoremal/")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean lagreMittGjoremal(Gjøremål gjoremal) {
        return GjoremalController.ny(gjoremal);
    }
}
