package server.services;
import jdk.internal.org.objectweb.asm.Handle;
import server.controllers.HandlelisteController;
import server.restklasser.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("/handleliste")
public class HandlelisteService {

    /**
     * Tar imot navn på handlelisten fra klienten, samt handlelistens innhold (JSON)
     * @param handleliste Et handlelisteobjekt med all nødvendig informasjon
     * @return int Handlelistens ID
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public int lagHandleliste(Handleliste handleliste) {
        try {
            return HandlelisteController.lagHandleliste(handleliste);
        }
        catch (SQLException e) {
            return -1;
        }
    }

    /**
     * Tar imot IDen til handlelisten fra klienten (i URLen), samt et nytt navn på listen.
     * @param handlelisteId Unikt identifiserbar handlelisteId som er lagret på serveren
     * @return String Det nye navnet, hentet fra databasen
     */
    @PUT
    @Path("/{handlelisteId}")
    @Consumes(MediaType.TEXT_PLAIN)
    public String endreNavn(@PathParam("handlelisteId") int handlelisteId, String nyttNavn) {
        //Her skal det komme kode
        return "det nye navnet, hentet fra databasen for å sjekke om det ble lagret";
    }

    /**
     * Tar imot IDen til handlelisten som skal slettes fra klienten (i URLen)
     * @param handlelisteId Unikt identifiserbar handlelisteId som er lagret på serveren
     * @return True hvis slettingen lykkes, false hvis ikke.
     */
    @DELETE
    @Path("/{handlelisteId}")
    public boolean slett(@PathParam("handlelisteId") int handlelisteId) {
        //Her skal det komme kode
        return false;
    }

    /**
     * Tar imot en int-array der hver element sitt tall er indeksen til elementet som skal checkes/uncheckes i listen over
     * varer i handlelisten. Så checker eller unchecker metoden feltenene (gjør dem true/false) på databasen avhengig av hva
     * de var før.
     * @param handlelisteId Unikt identifiserbar handlelisteId som er lagret på serveren
     * @param checkedUnchecked Array med int der hver int-verdi refererer til indeksen til et element i handlelisten som skal checkes/uncheckes
     *                         avhengig av hva det var før.
     * @return boolean[] Array som er like lang som vare-arrayen og sier hvilken av checkboksene som er checked. True = checked, false = unchecked.
     */
    @PUT
    @Path("/{handlelisteId}/checkboxes")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean[] checkEllerUncheck(@PathParam("handlelisteId") int handlelisteId, int[] checkedUnchecked) {
        //Her skal det komme kode
        //Bruk "NOT" på indeksene vi ønsker å endre i SQL for å spare tid
        return null;
    }

    /**
     * Tar imot en int-array der hver element sitt tall er indeksen til elementet som skal checkes/uncheckes i listen over
     * varer i handlelisten. Så checker eller unchecker metoden feltenene (gjør dem true/false) på databasen avhengig av hva
     * de var før.
     * @param pubEllerPriv Hvis true, skal listen være offentlig, hvis false, skal den være private
     * @return boolean Nåværende
     */
    @PUT
    @Path("/{handlelisteId}/private")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean[] endrePublic(boolean pubEllerPriv) {
        //Her skal det komme kode
        //Bruk "NOT" på indeksene vi ønsker å endre i SQL for å spare tid
        return null;
    }

    @GET
    @Path("/{handlelisteId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Handleliste getHandleliste(@PathParam("handlelisteId") int handlelisteId) {
        try {
            return HandlelisteController.getHandleliste(handlelisteId);
        }
        catch (SQLException e) {
            e.printStackTrace();
            return null;
        }

    }





}
