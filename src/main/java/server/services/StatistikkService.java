package server.services;

import server.restklasser.Nyhetsinnlegg;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.ArrayList;

/**
 * Created by Hallvard on 19.01.2018.
 *
 */
@Path("/StatistikkService")
public class StatistikkService {

    @GET
    @Path("/statistikk")
    @Produces
    public ArrayList<Nyhetsinnlegg> getnyhetsInnlegg(){
        return null;
    }
}

