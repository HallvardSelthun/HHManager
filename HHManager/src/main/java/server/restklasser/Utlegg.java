package server.restklasser;

import java.util.ArrayList;

public class Utlegg {
    private int utleggerId;
    private int utleggId;
    private double sum;
    private String beskrivelse;
    private ArrayList<Vare> varer;

    public Utlegg() {}

    public Utlegg(int utleggId) {
        this.utleggId = utleggId;
    }


    public int getUtleggerId() {
        return utleggerId;
    }

    public void setUtleggerId(int utleggerId) {
        this.utleggerId = utleggerId;
    }

    public int getUtleggId() {
        return utleggId;
    }

    public void setUtleggId(int utleggId) {
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

}
