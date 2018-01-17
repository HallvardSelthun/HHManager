package server.controllers;

import org.junit.Test;
import server.restklasser.Oppgjor;

import java.util.ArrayList;

import static org.junit.Assert.*;

public class UtleggControllerTest {
    @Test
    public void getMineOppgjor() throws Exception {
        ArrayList<Oppgjor> oppgjor = UtleggController.getMineOppgjor(2);
        System.out.println(oppgjor.get(0).getNavn());
        System.out.println(oppgjor.get(0).getUtleggJegSkylder().get(0).getBeskrivelse());

        ArrayList<Oppgjor> oppgjor2 = UtleggController.getMineOppgjor(3);
        System.out.println(oppgjor2.get(0).getNavn());
        //System.out.println("Bruker 1 skylder"+oppgjor2.get(0).getUtleggDenneSkylderMeg().get(0).getDelSum()+" kroner for "+oppgjor2.get(0).getUtleggDenneSkylderMeg().get(0).getBeskrivelse());
    }

}