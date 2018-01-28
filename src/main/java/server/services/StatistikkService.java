package server.services;

import server.controllers.StatistikkController;
import server.restklasser.Nyhetsinnlegg;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Hallvard on 19.01.2018.
 *
 */
@Path("/StatistikkService")
public class StatistikkService {
    /**
     * Henter nyheter gitt husholdningsid og skal gi en oversikt over hvem som har publisert flest innlegg
     * @param husholdningId
     * @return kaller på metoden getNyhetsstatistikk fra statistikkontroller
     */
    @GET
    @Path("{husholdningId}/nyheter")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<List<String>> getNyhetsStatistikk(@PathParam("husholdningId") int husholdningId){
        return StatistikkController.getNyhetsatistikk(husholdningId);
    }

    /**
     * Henter gjøremål gitt husholdningsid og skal gi en oversikt over hvem som har gjort flest gjøremål
     * @param husholdningId
     * @return kaller på metoden getgjoremalstatistikk fra statistikkontroller
     */
    @GET
    @Path("{husholdningId}/gjoremal")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<List<String>> getGjoremalStatistikk(@PathParam("husholdningId") int husholdningId){
        return StatistikkController.getGjoremalstatistikk(husholdningId);
    }

    /**
     * Henter antall varer kjøpt gitt husholdningsid
     * @param husholdningId
     * @return kaller på metoden getvarekjøpsstatistikk fra statistikkontroller
     */
    @GET
    @Path("{husholdningId}/varer")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<List<String>> getVarestatistikk(@PathParam("husholdningId") int husholdningId){
        return StatistikkController.getVarekjopstatistikk(husholdningId);
    }
}