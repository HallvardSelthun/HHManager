package server.restklasser;

//Husholdningsmedlem

public class HHMedlem {
//definere variabler
    int hhBrukerId;
    int husholdningId;
    boolean admin;

    /**
     * get og set metoder
     * @return
     */
    public int getHhBrukerId() {
        return hhBrukerId;
    }

    public void setHhBrukerId(int hhBrukerId) {
        this.hhBrukerId = hhBrukerId;
    }

    public int getHusholdningsId() {
        return husholdningId;
    }

    public void setHusholdningsId(int husholdningId) {
        this.husholdningId = husholdningId;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }


}
