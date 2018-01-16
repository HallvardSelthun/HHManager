package server.restklasser;

import java.util.ArrayList;

public class Oppgjør {
    private int utleggerId;
    private int oppgjørId;
    private double sum;
    private String beskrivelse;
    private int[] skylderPengerMedlemmer; //idene til medlemmer som skylder penger, gjør om til liste av oppgjørsbetalere
    private ArrayList<Vare> varer;

    public Oppgjør() {}

    public Oppgjør(int utleggerId, int oppgjørId, double sum, String beskrivelse, int[] skylderPengerMedlemmer, ArrayList<Vare> varer) {
        this.utleggerId = utleggerId;
        this.oppgjørId = oppgjørId;
        this.sum = sum;
        this.beskrivelse = beskrivelse;
        this.skylderPengerMedlemmer = skylderPengerMedlemmer;
        this.varer = varer;
    }

    public Oppgjør(int oppgjørId) {
        this.oppgjørId = oppgjørId;
    }


    public int getUtleggerId() {
        return utleggerId;
    }

    public void setUtleggerId(int utleggerId) {
        this.utleggerId = utleggerId;
    }

    public int getOppgjørId() {
        return oppgjørId;
    }

    public void setOppgjørId(int oppgjørId) {
        this.oppgjørId = oppgjørId;
    }

    public double getSum() {
        return sum;
    }

    public void setSum(double sum) {
        this.sum = sum;
    }

    public String getBeskrivelse() {
        return beskrivelse;
    }

    public void setBeskrivelse(String beskrivelse) {
        this.beskrivelse = beskrivelse;
    }

    public int[] getSkylderPengerMedlemmer() {
        return skylderPengerMedlemmer;
    }

    public void setSkylderPengerMedlemmer(int[] skylderPengerMedlemmer) {
        this.skylderPengerMedlemmer = skylderPengerMedlemmer;
    }

    public ArrayList<Vare> getVarer() {
        return varer;
    }

    public void setVarer(ArrayList<Vare> varer) {
        this.varer = varer;
    }
}
