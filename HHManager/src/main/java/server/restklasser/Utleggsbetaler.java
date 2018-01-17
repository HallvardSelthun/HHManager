package server.restklasser;

public class Utleggsbetaler {
    private int utleggsId;
    private boolean betalt;
    private double delSum;
    private int skyldigBrukerId;
    String navn;

    public Utleggsbetaler(){

    }

    public int getUtleggsId() {
        return utleggsId;
    }

    public void setUtleggsId(int utleggsId) {
        this.utleggsId = utleggsId;
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
}
