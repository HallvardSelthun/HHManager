package server.controllers;

import server.database.ConnectionPool;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Generell controller klasse. Her legges metoder hvis det viser seg at noe kode dupliserer seg i to av controllerklassene
 */
public class GenereltController {

    /**
     * Henter verdien fra én celle. Cellens innhold må være en string i databasen.
     * Lager en generell select-setning, men bruker bare id som identifikasjon.
     * Se variabelen "sqlsetning" for mal.
     *
     * @param kolonne Navnet på kolonnene i tabellen vi henter data fra
     * @param tabell Navnet på tabellen i databasen vi henter data fra
     * @param id Attributt i tabellen som må hete id og unikt identifisere raden
     * @return String. verdien til cellen fra select-setningen.
     */
    static String getString (String kolonne, String tabell, int id) {
        String sqlsetning = "SELECT "+ kolonne + " from "+ tabell + " where " + tabell + "id=?";
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)){
            preparedStatement.setString(1, Integer.toString(id));
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                resultSet.next();
                return resultSet.getString(kolonne);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Henter verdien fra én celle. Cellens innhold må være en int i databasen.
     * Lager en generell select-setning, men bruker bare id som identifikasjon.
     *
     * @param kolonne Navnet på kolonnene i tabellen vi henter data fra
     * @param tabell Navnet på tabellen i databasen vi henter data fra
     * @param id Attributt i tabellen som må hete id og unikt identifisere raden
     * @return Integer. verdien til cellen fra select-setningen.
     */
    static int getInt(String kolonne, String tabell, int id) {
        String sqlsetning = "SELECT "+ kolonne + " from "+ tabell + " where " + tabell + "id=?";
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)){
            preparedStatement.setString(1, Integer.toString(id));
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                resultSet.next();
                return resultSet.getInt(kolonne);
            } catch (Exception e) {
                e.printStackTrace();
                return -1;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    /**
     * Henter verdien fra én celle. Cellens innhold må være en sql Date i databasen.
     * Lager en generell select-setning, men bruker bare id som identifikasjon.
     *
     * @param kolonne Navnet på kolonnene i tabellen vi henter data fra
     * @param tabell Navnet på tabellen i databasen vi henter data fra
     * @param id Attributt i tabellen som må hete id og unikt identifisere raden
     * @return SQL Date. verdien til cellen fra select-setningen.
     */
    static Date getDate(String kolonne, String tabell, int id) {
        String sqlsetning = "SELECT "+ kolonne + " from "+ tabell + " where " + tabell + "id=?";
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)){
            preparedStatement.setString(1, Integer.toString(id));
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                resultSet.next();
                return resultSet.getDate(kolonne);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Sletter en rad i databasen. Raden finnes vha. tabellnavn, kolonnenavn og en unikt identifiserbar
     * entitetsId.
     * @param tabell Navnet på tabellen i databasen vi henter data fra
     * @param id Attributt i tabellen som må hete id og unikt identifisere raden
     * @return True hvis vi ikke fikk exceptions.
     */
    static boolean slettRad(String tabell, int id) {
        String sqlsetning = "DELETE FROM "+tabell+" WHERE handlelisteId = "+id+"";
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sqlsetning)){
            try {
                preparedStatement.executeUpdate();
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Oppdaterer/endrer én celle.
     * Må bruke id.
     * Kan brukes til alt selv om det 'setData' er en String.
     *
     * @param tabell som skal oppdateres
     * @param kolonneOppdater kolonne som skal oppdateres
     * @param setData dataen som skal endres
     * @param whereId id til etiteten som skal oppdateres
     */
    static boolean update(String tabell, String kolonneOppdater, String setData, int whereId) {
        String q = "update " + tabell + " set " + kolonneOppdater + "=? where " + tabell + "Id=?";
        try(Connection connection = ConnectionPool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(q)) {
            preparedStatement.setString(1, setData);
            preparedStatement.setInt(2, whereId);
            preparedStatement.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}


