package server.restklasser;

import java.util.ArrayList;

public class Utlegg {
    private int utleggerId;
    private int utleggId;
    private double sum;
    private String beskrivelse;
    private ArrayList<Utleggsbetaler> folkSomSkylderPenger; //idene til medlemmer som skylder penger, gjør om til liste av utleggsbetalere
    private ArrayList<Vare> varer;

    public Utlegg() {}

    public Utlegg(int utleggerId, int utleggId, double sum, String beskrivelse, ArrayList<Utleggsbetaler> folkSomSkylderPenger, ArrayList<Vare> varer) {
        this.utleggerId = utleggerId;
        this.utleggId = utleggId;
        this.sum = sum;
        this.beskrivelse = beskrivelse;
        this.folkSomSkylderPenger = folkSomSkylderPenger;
        this.varer = varer;
    }

    public Utlegg(int utleggId) {
        this.utleggId = utleggId;
    }


    public int getUtleggerId() {
        return utleggerId;
    }

    public void setUtleggerId(int utleggerId) {
        this.utleggerId = utleggerId;
    }

    public int getutleggId() {
        return utleggId;
    }

    public void setutleggId(int utleggId) {
        this.utleggId = utleggId;
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

    public ArrayList<Vare> getVarer() {
        return varer;
    }

    public void setVarer(ArrayList<Vare> varer) {
        this.varer = varer;
    }


    public ArrayList<Utleggsbetaler> getFolkSomSkylderPenger() {
        return folkSomSkylderPenger;
    }

    public void setFolkSomSkylderPenger(ArrayList<Utleggsbetaler> folkSomSkylderPenger) {
        this.folkSomSkylderPenger = folkSomSkylderPenger;
    }
}
