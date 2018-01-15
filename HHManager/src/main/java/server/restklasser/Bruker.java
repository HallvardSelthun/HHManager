package server.restklasser;

import java.util.ArrayList;

public class Bruker {

    int brukerId;
    String navn;
    String passord;
    String epost;
    int favHusholdning;
    HHMedlem[] HHMedlemmer;
    ArrayList<Gjøremål> gjøremål = new ArrayList<>();
    double balanse;

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

    public boolean regBrukerIDB(){
        //KODE KODE KODE KODE KODE
        return false;
    }

}
