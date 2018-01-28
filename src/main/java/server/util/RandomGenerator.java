package server.util;

import java.util.Random;

/**
 * Klasse for å generere ting som er tilfeldige
 */
public class RandomGenerator {

    /**
     * Lager an tilfeldig string bestående av
     * store (uppercase, u) og små (lowercase, l) bokstaver, tall (numbers, n)
     * og symboler ved tallene på tastaturet (symboles, s)
     *
     * @param lengde på string
     *
     * @return tilfeldig string
     */
    public static String stringulns(int lengde) {
        final String store = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String sma = store.toLowerCase();
        final String tall = "0123456789";
        //final String sym = "!\"#$%&/()=?§'+´`";
        final String alfabet = store + sma + tall; //+ sym;

        StringBuilder buf = new StringBuilder();
        Random r = new Random();
        int number;
        for (int i = 0; i < lengde; ++i) {
            number = r.nextInt(alfabet.length());
            buf.append(alfabet.charAt(number));
        }
        return buf.toString();
    }
}
