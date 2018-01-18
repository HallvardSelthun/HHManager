package server.restklasser;

import java.sql.Date;

/**
 *
 * Created by BrageHalse on 10.01.2018.
 */
public class Gjøremål {
    private int gjøremålId;
    private int husholdningId;
    private int hhBrukerId;
    private boolean fullført;
    private String beskrivelse;
    private Date frist;

    public int getGjøremålId(){
        return gjøremålId;
    }

    public int getHusholdningId(){
        return husholdningId;
    }

    public void setGjøremålId(int gjøremålId) {
        this.gjøremålId = gjøremålId;
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

    public boolean getFullført(){
        return fullført;
    }

    public void setFullført(boolean nyVariabel){
        this.fullført = nyVariabel;
    }

    public String getBeskrivelse(){
        return beskrivelse;
    }

    public boolean isFullført() {
        return fullført;
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
