package server.restklasser;

import java.util.ArrayList;

/**
 *
 * Created by BrageHalse on 10.01.2018.
 */
public class Husholdning {
    private int husholdningId;
    private String navn;
    private ArrayList<Handleliste> handlelister = new ArrayList<>();
    private ArrayList<Gjoremal> gjoremal = new ArrayList<>();
    private ArrayList<Nyhetsinnlegg> nyhetsinnlegg = new ArrayList<>();
    private ArrayList<Bruker> medlemmer = new ArrayList<>();
    private String adminId;

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public ArrayList<Handleliste> getHandlelister() {
        return handlelister;
    }

    public void setHandlelister(ArrayList<Handleliste> handlelister) {
        this.handlelister = handlelister;
    }

    public ArrayList<Gjoremal> getGjoremal() {
        return gjoremal;
    }

    public void setGjoremal(ArrayList<Gjoremal> gjoremal) {
        this.gjoremal = gjoremal;
    }

    public ArrayList<Nyhetsinnlegg> getNyhetsinnlegg() {
        return nyhetsinnlegg;
    }

    public void setNyhetsinnlegg(ArrayList<Nyhetsinnlegg> nyhetsinnlegg) {
        this.nyhetsinnlegg = nyhetsinnlegg;
    }

    public ArrayList<Bruker> getMedlemmer() {
        return medlemmer;
    }

    public void setMedlemmer(ArrayList<Bruker> medlemmer) {
        this.medlemmer = medlemmer;
    }

    public void addHandleliste(Handleliste handleliste){
        handlelister.add(handleliste);
    }

    public void addMedlem(Bruker bruker){
        medlemmer.add(bruker);
    }

    public void addNyhetsinnlegg(Nyhetsinnlegg nyhetsinnlegg){
        this.nyhetsinnlegg.add(nyhetsinnlegg);
    }

    public void addGjormal(Gjoremal gjoremal){
        this.gjoremal.add(gjoremal);
    }

    public int getHusholdningId() {
        return husholdningId;
    }

    public void setHusholdningId(int husholdningId) {
        this.husholdningId = husholdningId;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }
}
