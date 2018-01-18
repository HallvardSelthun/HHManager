package server.controllers;

import org.junit.Test;
import server.restklasser.Oppgjor;
import server.restklasser.Utleggsbetaler;

import java.util.ArrayList;

import static org.junit.Assert.*;

public class UtleggControllerTest {
    @Test
    public void getMineOppgjor() throws Exception {
        ArrayList<Oppgjor> oppgjor = UtleggController.getMineOppgjor(2);

        ArrayList<Utleggsbetaler> utleggJegSkylder = new ArrayList<>();
        //Sjekk om jeg (brukerId2) skylder bruker1 no
        for (int i = 0; i < oppgjor.size(); i++) {
            System.out.println("oppgjor.size() "+oppgjor.size());
            System.out.println("oppgjor.get(i).getBrukerId() "+oppgjor.get(i).getBrukerId());
            if (oppgjor.get(i).getBrukerId() == 1) {
                System.out.println("Check good");
                utleggJegSkylder = oppgjor.get(i).getUtleggJegSkylder();
            }
        }
        for (int i = 0; i < utleggJegSkylder.size(); i++) {
            System.out.println("Skylder bruker 1 "+utleggJegSkylder.get(i).getDelSum()+" kroner for "+utleggJegSkylder.get(i).getBeskrivelse());
            assertEquals((int)utleggJegSkylder.get(i).getDelSum(), (int)100);
        }

        ArrayList<Oppgjor> oppgjor2 = UtleggController.getMineOppgjor(1);
        System.out.println(oppgjor2.get(0).getNavn());
        //System.out.println("Bruker 1 skylder"+oppgjor2.get(0).getUtleggDenneSkylderMeg().get(0).getDelSum()+" kroner for "+oppgjor2.get(0).getUtleggDenneSkylderMeg().get(0).getBeskrivelse());
    }

}