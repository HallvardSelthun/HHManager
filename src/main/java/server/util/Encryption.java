package server.util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.KeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.Random;

/**
 * Utility class to handle password encryption and hash check
 *
 * Source: https://github.com/ScrumTeam2/MinVakt/blob/master/src/main/java/no/ntnu/stud/minvakt/controller/encryption/Encryption.java
 *
 * @author Audun
 */
public class Encryption {
    public static Encryption instance = new Encryption();
    /**
     * Checks whether two passwords are the same using an input password,
     * salt and a hash.
     *
     * @param pass       Password from user
     * @param saltString Salt from database.
     * @param hashString Hash from database
     *
     * @return boolean whether they matched.
     */
    public boolean isPassOk(String pass, String hashString, String saltString) {
        byte[] salt = stringToByte(saltString);
        byte[] hashPass = stringToByte(hashString);


        byte[] hash;
        KeySpec spec = new PBEKeySpec(pass.toCharArray(), salt, 65536, 128);

        try {
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            hash = f.generateSecret(spec).getEncoded();
        } catch (Exception e) {
            System.out.println("Issue with secret key factory in password decryption.\n\n" + e.getMessage());
            return false;
        }
        return Arrays.equals(hashPass, hash);
    }

    /**
     * Creates a salt and hash for storage in the database using only an input password.
     *
     * @param password password you want to encrypt
     *
     * @return a string array of the resulting hash and salt.
     */
    public String[] passEncoding(String password) {
        Random rand = new Random();
        byte[] salt = new byte[16];
        byte[] hash;
        rand.nextBytes(salt);
        KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 128);

        try {
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            hash = f.generateSecret(spec).getEncoded();
        } catch (Exception e) {
            System.out.println("Issue with SecretKeyFactory in password encrpytion." + e.getMessage());
            return null;
        }

        Base64.Encoder enc = Base64.getEncoder();
        String[] out = new String[2];


        out[0] = (enc.encodeToString(hash));
        out[1] = (enc.encodeToString(salt));
        return out;
    }

    /**
     * Converts String to byte array
     *
     * @param string the string to convert
     *
     * @return return a byte array representing the string
     */
    private byte[] stringToByte(String string) {
        Base64.Decoder dec = Base64.getDecoder();
        return dec.decode(string);
    }
}