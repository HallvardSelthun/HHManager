package server.restklasser;

import java.util.ArrayList;

//Litt usikker på om vi faktisk skal ha denne klassen. -Toni
public class UtleggsBruker extends Bruker {

    ArrayList<Utlegg> mineUtlegg;
    ArrayList<Utleggsbetaler> utleggFolkSkylder;

    public UtleggsBruker() {

    }

    public UtleggsBruker(ArrayList<Utlegg> mineUtlegg, ArrayList<Utleggsbetaler> utleggFolkSkylder) {
        this.mineUtlegg = mineUtlegg;
        this.utleggFolkSkylder = utleggFolkSkylder;
    }




}
