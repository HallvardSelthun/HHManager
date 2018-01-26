package server.restklasser;

import java.sql.Date;

/**
 *
 * Created by BrageHalse on 10.01.2018.
 */
public class Nyhetsinnlegg {
    /**
     * Definerer variabler
     */
    private int nyhetsinnleggId;
    private int forfatterId;
    private int husholdningId;
    private Date dato;
    private String tekst;

    //Tom konstruktør
    public Nyhetsinnlegg (){
    }

    /**
     * Metoder til variablene, get og set-metoder
     * @return
     */
    public int getNyhetsinnleggId() {
        return nyhetsinnleggId;
    }

    public int getForfatterId() {
        return forfatterId;
    }

    public int getHusholdningsId() {
        return husholdningId;
    }

    public String getTekst() {
        return tekst;
    }

    public Date getDato() {
        return dato;
    }

    public void setDato(Date dato) {
        this.dato = dato;
    }

    public void setNyhetsinnleggId(int nyhetsinnleggId) {
        this.nyhetsinnleggId = nyhetsinnleggId;
    }

    public void setForfatterId(int forfatterId) {
        this.forfatterId = forfatterId;
    }

    public void setHusholdningId(int husholdningId) {
        this.husholdningId = husholdningId;
    }

    public void setTekst(String nyTekst){
        this.tekst = nyTekst;
    }
}
