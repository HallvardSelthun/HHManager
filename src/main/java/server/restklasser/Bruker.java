package server.restklasser;

import java.util.ArrayList;

public class Bruker {

    private int brukerId;
    private String navn;
    private String passord;
    private String nyttpassord;
    private String epost;
    private int favHusholdning;
    private HHMedlem[] HHMedlemmer;
    private ArrayList<Gjoremal> gjoremal = new ArrayList<>();
    private double balanse;

    public HHMedlem[] getHHMedlemmer() {
        return HHMedlemmer;
    }

    public void setHHMedlemmer(HHMedlem[] HHMedlemmer) {
        this.HHMedlemmer = HHMedlemmer;
    }

    public String getNavn(){return navn;}

    public void setNavn(String nyttNavn){this.navn = nyttNavn;}

    public ArrayList<Gjoremal> getGjoremal() {
        return gjoremal;
    }

    public void addGjoremal(Gjoremal gjoremal){
        this.gjoremal.add(gjoremal);
    }

    public int getBrukerId() {
        return brukerId;
    }

    public void setBrukerId(int brukerId) {
        this.brukerId = brukerId;
    }

    public String getPassord() {
        return passord;
    }

    public void setPassord(String passord) {
        this.passord = passord;
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
