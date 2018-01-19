package server.controllers;

import server.database.ConnectionPool;
import server.restklasser.Nyhetsinnlegg;

import java.sql.*;
import java.sql.Date;
import java.util.*;

/**
 *
 * Created by BrageHalse on 19.01.2018.
 */
public class StatistikkController {

    public static ArrayList<List<String>> getNyhetsatistikk(int husholdningId){
        ArrayList<List<String>> nyhetstatistikk = new ArrayList<List<String>>();
        String query = "SELECT COUNT(nyhetsinnleggId) antall, navn FROM nyhetsinnlegg LEFT JOIN bruker ON forfatterId=brukerId WHERE husholdningId = "+husholdningId+" AND dato>DATE_ADD(NOW(), INTERVAL -1 MONTH ) GROUP BY forfatterId";

        try (Connection con = ConnectionPool.getConnection()){
            PreparedStatement ps = con.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                ArrayList<String> liste1  = new ArrayList<>();
                liste1.add(Integer.toString(rs.getInt("antall")));
                liste1.add(rs.getString("navn"));
                nyhetstatistikk.add(liste1);
            }
            return nyhetstatistikk;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return null;
    }

    public static ArrayList<List<String>> getGjøremålstatistikk(int husholdningId){
        ArrayList<List<String>> gjøremålstatistikk = new ArrayList<List<String>>();
        String query = "SELECT COUNT(gjøremålId) antal, navn FROM gjøremål LEFT JOIN bruker ON utførerId = brukerId WHERE husholdningId = "+husholdningId+" AND fullført = 1 GROUP BY utførerId";

        try(Connection con = ConnectionPool.getConnection()){
            PreparedStatement ps = con.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                ArrayList<String> list = new ArrayList<>();
                list.add(Integer.toString(rs.getInt("antal")));
                list.add(rs.getString("navn"));
                gjøremålstatistikk.add(list);
            }
            return gjøremålstatistikk;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return null;
    }
}
