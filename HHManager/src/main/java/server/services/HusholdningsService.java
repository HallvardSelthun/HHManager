package server.services;

import server.controllers.HusholdningController;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.*;
/**
 * <h1>Service for de fleste funksjoner innad i programmet</h1>
 * Gateway til å hente og legge inn all data i databasen.
 *
 * @author  Toni Vucic
 * @version 1.0
 * @since   10.01.2018
 */

@Path("/hhservice")
public class HusholdningsService {

    /**
     * Legger inn en ny husholdning og returnerer dens ID
     * @param navn Husholdningens nye navn
     * @return int Husholdningens ID i databasen og til bruk på nettsiden.
     */
    @POST
    @Path("/husholdning/{navn}")
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagreNyHusholdning(@PathParam("navn") String navn) {
        return HusholdningController.ny(navn);
    }


    /**
     * Endrer navnet på en husholdning. Sender nytt navn til databasen vha. IDen.
     * @param id Husholdningens ID
     * @param navn Husholdningens nye navn
     * @return boolean True hvis det lykkes, false hvis det ikke lykkes.
     */
    @PUT
    @Path("/husholdning/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean endreHusholdningsNavn(@PathParam("id") int id, String navn) {
        //Sende husholdningsnavn til database
        //for å endre navn på husholdning. SQL lager ny ID, vi returnerer den
        return false;
    }

    /**
     * Brukes for å slette en husholdning fra databasen.
     * @param id Husholdningens ID
     * @return boolean True hvis det lykkes, false hvis det ikke lykkes.
     */
    @DELETE
    @Path("/husholdning/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean slettHusholdning(@PathParam("navn") int id) {
        return false;
    }
}
