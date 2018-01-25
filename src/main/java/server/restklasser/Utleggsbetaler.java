package server.restklasser;

public class Utleggsbetaler {
    //Definerer variabler
    private int utleggId;
    private boolean betalt;
    private double delSum;
    private int skyldigBrukerId;
    private String navn; //Navn som hører til skyldigBrukerId
    private String beskrivelse; //Beskrvelse av utlegget, hentes fra Utlegg-klassen ved uthenting

    //tom konstruktør
    public Utleggsbetaler(){
    }

    //Ulike get og set-metoder
    public int getUtleggId() {
        return utleggId;
    }

    public void setUtleggId(int utleggId) {
        this.utleggId = utleggId;
    }

    public boolean isBetalt() {
        return betalt;
    }

    public void setBetalt(boolean betalt) {
        this.betalt = betalt;
    }

    public double getDelSum() {
        return delSum;
    }

    public void setDelSum(double delSum) {
        this.delSum = delSum;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }

    public int getSkyldigBrukerId() {
        return skyldigBrukerId;
    }

    public void setSkyldigBrukerId(int skyldigBrukerId) {
        this.skyldigBrukerId = skyldigBrukerId;
    }

    public String getBeskrivelse() {
        return beskrivelse;
    }

    public void setBeskrivelse(String beskrivelse) {
        this.beskrivelse = beskrivelse;
    }

}
