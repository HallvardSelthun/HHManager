package server.restklasser;

import java.util.ArrayList;

import java.sql.Date;
import java.util.ArrayList;

/**
 *
 * Created by BrageHalse on 10.01.2018.
 */

public class Handleliste {

    /**
     * Definerer variabler
     */
    private String tittel;
    private int handlelisteId;
    private int husholdningId;
    private int skaperId;
    private ArrayList<Vare> varer = new ArrayList<>();
    private boolean offentlig;
    private Date frist;
    private int gjemt;

    public int getGjemt() {
        return gjemt;
    }

    public void setGjemt(int gjemt) {
        this.gjemt = gjemt;
    }

    public Handleliste() {
        //tom konstruktør
    }

    public Handleliste(int handlelisteId, int husholdningId, Date frist, boolean offentlig, String navn, int skaperId) {
        this.handlelisteId = handlelisteId;
        setHusholdningId(husholdningId);
        setFrist(frist);
        setOffentlig(offentlig);
        setTittel(navn);
        setSkaperId(skaperId);
    }

    public Handleliste(int handlelisteId) {
        this.handlelisteId = handlelisteId;
    }

    public void setVarer(ArrayList<Vare> varer) {
        this.varer = varer;
    }

    public int getHandlelisteId(){ return handlelisteId; }

    public int getHusholdningId(){
        return husholdningId;
    }

    public void setHusholdningId(int id) {
        husholdningId = id;
    }

    public void setHandlelisteId(int handlelisteId) {
        this.handlelisteId = handlelisteId;
    }

    public ArrayList<Vare> getVarer() {
        return varer;
    }

    public void addVarer(Vare vare){
        varer.add(vare);
    }


    public void setSkaperId(int skaperId) {
        this.skaperId = skaperId;
    }

    public int getSkaperId(){
        return skaperId;
    }

    public String getTittel() {
        return tittel;
    }

    public void setTittel(String tittel) {
        this.tittel = tittel;
    }

    public boolean isOffentlig() {
        return offentlig;
    }

    public void setOffentlig(boolean offentlig) {
        this.offentlig = offentlig;
    }

    public Date getFrist() {
        return frist;
    }

    public void setFrist(Date frist) {
        this.frist = frist;
    }

}

