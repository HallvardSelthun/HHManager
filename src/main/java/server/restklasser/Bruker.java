package server.restklasser;

import java.util.ArrayList;

public class Bruker {

    private int brukerId;
    private String navn;
    private String hashen;
    private String salt;
    private String epost;
    private int favHusholdning;
    private HHMedlem[] HHMedlemmer;
    private ArrayList<Gjøremål> gjøremål = new ArrayList<>();
    private double balanse;

    public HHMedlem[] getHHMedlemmer() {
        return HHMedlemmer;
    }

    public void setHHMedlemmer(HHMedlem[] HHMedlemmer) {
        this.HHMedlemmer = HHMedlemmer;
    }

    public String getNavn(){return navn;}

    public void setNavn(String nyttNavn){this.navn = nyttNavn;}

    public ArrayList<Gjøremål> getGjøremål() {
        return gjøremål;
    }

    public void addGjøremål(Gjøremål gjøremål){
        this.gjøremål.add(gjøremål);
    }

    public int getBrukerId() {
        return brukerId;
    }

    public void setBrukerId(int brukerId) {
        this.brukerId = brukerId;
    }

    public String getHashen() {
        return hashen;
    }

    public void setHashen(String hashen) {
        this.hashen = hashen;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getEpost() {
        return epost;
    }

    public double getBalanse() {
        return balanse;
    }

    public void setBalanse(double balanse) {
        this.balanse = balanse;
    }

    public void setEpost(String epost) {
        this.epost = epost;
    }

    public int getFavHusholdning() {
        return favHusholdning;
    }

    public void setFavHusholdning(int favHusholdning) {
        this.favHusholdning = favHusholdning;
    }

}
