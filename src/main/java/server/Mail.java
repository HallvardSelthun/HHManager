package server;

import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import static javax.swing.JOptionPane.*;
import server.controllers.*;
/*
import static database.Databasecommunication.*;
import static security.Security.generateRandomPassword;
import static security.Security.hashPassword;*/

// trenger en metode som sender mail til en array med personer samtidig. To forskjellige mailer. En til gamle medlemmer
// som legges til i en ny husholdning og en til nye medlemmer som må registrere seg før de automatisk legges til i husholdningen.

/**
 * Denne klassen kobles opp mot Googles mail servere og sender mail til en bruker
 */
public class Mail{
    private static final String avsender = "officialHouseHoldManager";
    private static final String passord = "HHManagerT6";
    private static final String sub = "Velkommen til HouseHoldManager";
    private static final String midNavn = "Kimia";
    private static Connection con;
    private static PreparedStatement ps;
    private static ResultSet rs;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int PASSORD_LENGDE = 8;
    private String regards = "\n\nTakk for at du bruker HouseHoldManager." + "\n\nVennlig hilsen,"
            + "\nHouseHoldManagers utviklingsteam <3";


    /**
     * Sender mail til alle nye medlemmer i en husholdning, som ER en del av systemet
     */

    public static void sendAllerede(ArrayList<String> eposter, String husholdnig) {
        for (String epost :
                eposter) {
            epost.trim().toLowerCase();
        }
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");

        //checks if password is correct to login to email account
        Session session = Session.getDefaultInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(avsender,passord);
                    }
                });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setSubject(sub);
            String msg = "Velkommen til HouseHoldManager, systemet som gir deg en enklere hverdag." +
                    "\nDu har blitt lagt til i husholdningen " + husholdnig +
                    "\nTrykk på linken for å komme til HHManager sin forside: localhost:8080/HHManager\n";
            message.setText(msg);

            InternetAddress[] addresses = new InternetAddress[eposter.size()];
            for (int i = 0; i < eposter.size(); i++) {
                addresses[i] = new InternetAddress(eposter.get(i));
            }
            message.addRecipients(Message.RecipientType.BCC, addresses);
            Transport.send(message);

        } catch(MessagingException e){throw new RuntimeException(e);}
    }

    /**
     * Denne metoden sjekker om en email allerede eksisterer i databasen
     * @param emailad er email-adressen til brukeren som får nytt passord generert
     * @return true hvis email-adressen er funnet i databasen, false hvis ikke.
   **/

    private static boolean sjekkEmail(String emailad) {
        boolean ok = false;
/*try {
            con = getConnection();   // creates connection to the database
            ps = con.prepareStatement("SELECT COUNT(*)'number' FROM users WHERE email = ?;");
            ps.setString(1, emailad);
            rs = ps.executeQuery();
            while (rs.next()) {
                int answer = rs.getInt("number");
                ok = answer != 0;
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            ok = false;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closePreparedStatement(ps);
            closeResultSet(rs);
            closeConnection(con);
        }*/

        ok = true;
        return ok;
    }

/**
     * Denne metoden genererer et nytt passord og sender det til emailen til en bruker fra selskapets email.
     * @param email er email-adressen til brukeren

**/
    public static void sendEn(String email){
        String out = email.trim().toLowerCase();
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");

//checks if password is correct to login to email account

        Session session = Session.getDefaultInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(avsender,passord);
                    }
                });

        if(sjekkEmail(out)) {
            try {
                MimeMessage message = new MimeMessage(session);
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(out));
                message.setSubject(sub);

                String pw = generateRandomPassword();   // generates random password
                if (updatePassword(out, pw)) {
                    String regards = "\n\nTakk for at du bruker HouseHoldManager." + "\n\nVennlig hilsen,"
                            + "\nHouseHoldManagers utviklingsteam <3";
                    String msg = "Velkommen til HouseHoldManager, systemet som gir deg en enklere hverdag. Her er ditt generte passord. Bruk dette når du skal logge deg inn i systemet for første gang.";
                    String text = "Hei " + midNavn + "!"  + "\n" + msg +  "\n\n" + "Passord: " + pw + regards;
                    message.setText(text);
                    Transport.send(message);
                    //showMessageDialog(null, "New password generated and sent to your email!");
                } else {
                    //showMessageDialog(null, "Something went wrong when updating the password in the database.\nPlease try again", "Error", ERROR_MESSAGE);
                }
            } catch(MessagingException e){throw new RuntimeException(e);}
        } else{
            showMessageDialog(null, "Email not found in database.", "Error", ERROR_MESSAGE);
        }
    }

/**
     * This method updates the new password in the database
     * @param email is the email-address of the user
     * @param pw    is the new generated password of the user
     * @return true if the password is successfully updated in database, false if not.

**/

    private static boolean updatePassword(String email, String pw) {
        boolean ok = false;
        /*try {
            con = getConnection();
            ps = con.prepareStatement("UPDATE users SET password = ? WHERE email = ?;");
            ps.setString(1, hashPassword(pw));
            ps.setString(2, email.trim().toLowerCase());
            ps.executeUpdate();
            ps.close();
            ok = true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closePreparedStatement(ps);
            closeResultSet(rs);
            closeConnection(con);
        }
*/
        ok = true;
        return ok;
    }

/**
     * This method gets the name of the user with the specific email address.
     * @param email is the email of the user
     * @return the fullname of the user
**/

    /*public static String getName(String email){
        String name = "";
        try {
            con = getConnection();
            ps = con.prepareStatement("SELECT * FROM users WHERE email = ?;");
            ps.setString(1, email.trim().toLowerCase());
            rs = ps.executeQuery();
            while(rs.next()) {
                name = rs.getString("full_name");
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closePreparedStatement(ps);
            closeResultSet(rs);
            closeConnection(con);
        }
        return "Hello " + name + "!";
    }*/


/**
     * Denne metoden returnerer et tilfeldig generert passord med lengden av objekt variabelen PASSORD_LENGDE
     * @return et tilfeldig generert passord
  **/

    public static String generateRandomPassword() {
        if(PASSORD_LENGDE < 1) {
            return "The length of the password generated must be positive";
        }
        StringBuilder sb = new StringBuilder(PASSORD_LENGDE);
        for(int i = 0; i < PASSORD_LENGDE; i++) {
            int c = RANDOM.nextInt(62);   // generates a random int from zero to 62
            if(c <= 9) {
                sb.append(String.valueOf(c));   // adds the number to the StringBuilder
            } else if(c < 36) {
                sb.append((char)('a' + c - 10));   // adds the lower case letter of the number to the StringBuilder
            } else {
                sb.append((char)('A' + c - 36));   // adds the upper case letter of the number to the StringBuilder
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Mail mail = new Mail();
        String email = "kimia.abtahi@gmail.com";
        mail.sendEn(email);

    }
}
