package server.util;

import java.util.Random;

/**
 * Klasse for å generere ting som er tilfeldige
 */
public class RandomGenerator {

    /**
     * Lager an tilfeldig string bestående av
     * store (uppercase, u) og små (lowercase, l) bokstaver og tall (numbers, n)
     *
     * @param lengde på string
     *
     * @return tilfeldig string
     */
    public static String stringuln(int lengde) {
        final String store = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String sma = store.toLowerCase();
        final String tall = "0123456789";
        final String alfabet = store + sma + tall;

        StringBuilder buf = new StringBuilder();
        Random r = new Random();
        int number;
        for (int i = 0; i < lengde; ++i) {
            number = r.nextInt(alfabet.length());
            buf.append(alfabet.charAt(number));
        }
        return buf.toString();
    }

    public static void main(String[] args) {
        System.out.println(stringuln(5));
    }
}
