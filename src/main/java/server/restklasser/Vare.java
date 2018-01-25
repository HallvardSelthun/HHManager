package server.restklasser;

import java.sql.Date;

public class Vare {
    //Definerer variabler
    private int vareId;
    private int handlelisteId;
    private String varenavn;
    private boolean kjopt;
    private int kjoperId;
    private Date datoKjopt;

    //Ulike get og set-metoder
    public Date getDatoKjopt() {
        return datoKjopt;
    }

    public void setDatoKjopt(Date datoKjopt) {
        this.datoKjopt = datoKjopt;
    }
    public int getHandlelisteId() {
        return handlelisteId;
    }

    public void setHandlelisteId(int handlelisteId) {
        this.handlelisteId = handlelisteId;
    }

    public int getKjoperId() {
        return kjoperId;
    }

    public void setKjoperId(int kjoperId) {
        this.kjoperId = kjoperId;
    }

    public int getVareId() {
        return vareId;
    }

    public void setVareId(int vareId) {
        this.vareId = vareId;
    }

    public String getVarenavn() {
        return varenavn;
    }

    public void setVarenavn(String varenavn) {
        this.varenavn = varenavn;
    }

    public boolean isKjopt() {
        return kjopt;
    }

    public void setKjopt(boolean kjopt) {
        this.kjopt = kjopt;
    }



}
