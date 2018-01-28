package server.restklasser;

import java.sql.Date;

/**
 *
 * Created by BrageHalse on 10.01.2018.
 */

public class Gjoremal {
    /**
     * Initierer variabler
     */
    private int gjoremalId;
    private int husholdningId;
    private int hhBrukerId;
    private boolean fullfort;
    private String beskrivelse;
    private Date frist;

    /**
     * Metoder for å hente gjøremål-husholdningsid, sjekke om noe er fullført, tidsfrist med tanke på gjøremål
     * og en beskrivelse.
     * @return
     */

    public int getGjoremalId(){
        return gjoremalId;
    }

    public int getHusholdningId(){
        return husholdningId;
    }

    public void setGjoremalId(int gjoremalId) {
        this.gjoremalId = gjoremalId;
    }

    public void setHusholdningId(int husholdningId) {
        this.husholdningId = husholdningId;
    }

    public void setHhBrukerId(int hhBrukerId) {
        this.hhBrukerId = hhBrukerId;
    }

    public int getHhBrukerId(){
        return hhBrukerId;
    }

    public boolean getFullfort(){
        return fullfort;
    }

    public void setFullfort(boolean nyVariabel){
        this.fullfort = nyVariabel;
    }

    public String getBeskrivelse(){
        return beskrivelse;
    }

    public boolean isFullfort() {
        return fullfort;
    }

    public Date getFrist() {
        return frist;
    }

    public void setFrist(Date frist) {
        this.frist = frist;
    }

    public void setBeskrivelse(String nyBeskrivelse){
        this.beskrivelse = nyBeskrivelse;
    }
}
